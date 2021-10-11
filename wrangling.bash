#!/usr/bin/env bash

echo "This is a file of command examples and is not intended to be run as-is"
exit 1

genome_ids=(
  "GCA_002271885.2"
  "GCA_002271895.2"
  "GCF_000710875.1"
)

loc_ids=(
  "LOC107866321"
  "LOC107843860"
  "LOC107859362"
  "LOC107864612"
  "LOC107873245"
  "LOC107878477"
  "LOC107839289"
  "LOC107845303"
  "LOC107845304"
  "LOC107845460"
  "LOC107847473"
)

# eg pruning for exons and start coordinates only
for g in "${genome_ids[@]}"
do
  awk -F '\t' '$3=="exon" {print $3, $4, $5}' datasets/ncbi_dataset/data/${g}/genomic.gff > datasets/ncbi_dataset/data/${g}/exons.gff
done

margin=10000
for g in "${genome_ids[@]}"
do
  echo "== Processing genome ${g} =="
  while read line; do
    coord=$(echo $line | cut -d\  -f2)
    locname=$(echo $line | cut -d\/ -f4 | cut -d\. -f1)
    length=$(grep $locname genes/length_lookup.txt | cut -d\  -f2)
    start=$(expr $coord - $margin)
    end=$(expr $coord + $length + $margin)
    echo "Extracting data between $start and $end for $locname length $length with margin..."
    awk -F\  -v start="$start" -v end="$end" -v locname="$locname" '(  (!/^#/) && ($4 >= start ) && ( $5 <= end ) ) {print locname, $4, $3}' datasets/ncbi_dataset/data/${g}/genomic.gff > graph/$g-$locname.txt
  done < blast/reports/${g}
done

# create blast db directories
for g in "${genome_ids[@]}"
do
  mkdir -p blast/dbs/${g}
done

# # create the blast DBs
for g in "${genome_ids[@]}"
do
  for ((i=1;i<=12;i++)); 
  do 
     makeblastdb -in datasets/ncbi_dataset/data/${g}/chr${i}.fna -dbtype nucl -parse_seqids -out blast/dbs/${g}/chr${i}.blast
  done
done

makeblastdb -in datasets/ncbi_dataset/data/GCA_011745845.1/*.fna -dbtype nucl -parse_seqids -out blast/dbs/GCA_011745845.1/all.blast
makeblastdb -in datasets/ncbi_dataset/data/GCA_011745865.1/*.fna -dbtype nucl -parse_seqids -out blast/dbs/GCA_011745865.1/all.blast

# create blast results directories
for g in "${genome_ids[@]}"
do
  mkdir -p blast/results/${g}
done

# run blast to find gene coordinates
for g in "${genome_ids[@]}"
do
  blastn -task blastn-short -db blast/dbs/${g}/chr1.blast -query genes/LOC107866321.fsa -out blast/results/${g}/LOC107866321.out
  blastn -task blastn-short -db blast/dbs/${g}/chr1.blast -query genes/LOC107843860.fsa -out blast/results/${g}/LOC107843860.out
  blastn -task blastn-short -db blast/dbs/${g}/chr2.blast -query genes/LOC107859362.fsa -out blast/results/${g}/LOC107859362.out
  blastn -task blastn-short -db blast/dbs/${g}/chr3.blast -query genes/LOC107864612.fsa -out blast/results/${g}/LOC107864612.out
  blastn -task blastn-short -db blast/dbs/${g}/chr6.blast -query genes/LOC107873245.fsa -out blast/results/${g}/LOC107873245.out
  blastn -task blastn-short -db blast/dbs/${g}/chr7.blast -query genes/LOC107878477.fsa -out blast/results/${g}/LOC107878477.out
  blastn -task blastn-short -db blast/dbs/${g}/chr8.blast -query genes/LOC107839289.fsa -out blast/results/${g}/LOC107839289.out
  blastn -task blastn-short -db blast/dbs/${g}/chr10.blast -query genes/LOC107845303.fsa -out blast/results/${g}/LOC107845303.out
  blastn -task blastn-short -db blast/dbs/${g}/chr10.blast -query genes/LOC107845304.fsa -out blast/results/${g}/LOC107845304.out  
  blastn -task blastn-short -db blast/dbs/${g}/chr10.blast -query genes/LOC107845460.fsa -out blast/results/${g}/LOC107845460.out
  blastn -task blastn-short -db blast/dbs/${g}/chr11.blast -query genes/LOC107847473.fsa -out blast/results/${g}/LOC107847473.out
done

# pull the locations
for g in "${genome_ids[@]}"
do
  for f in blast/results/${g}/*.out
  do
    grep -m 1 Sbjct $f /dev/null >> blast/reports/${g}
  done
done

for g in "${genome_ids[@]}"
do
  cat blast/reports/$g | awk -F '/' '{print $4}' | awk -F '[[:space:]]+' '{print $1, $2}' | sed 's/.out:Sbjct//g' > blast/locs/${g}
done

for g in "${genome_ids[@]}"
do
  awk -F '\t' '$3=="gene" {print $1, $4}' datasets/ncbi_dataset/data/${g}/genomic.gff > graph/${g}
done

for g in "${genome_ids[@]}"
do
  for loc in "${loc_ids[@]}"
  do
    cat graph/$g-$loc.txt | jq --raw-input --slurp 'split("\n") | map(split(" ")) | .[0:-1] | map( { "data": { "id": .[1] } }, { "data": { "id": .[2] } }, { "data": { "id": (.[1] + "-" + .[2]), "source": .[1], "target": .[2] } } )' >> cyto/$g.js
    cat graph/$g-$loc.txt | jq --raw-input --slurp 'split("\n") | map(split(" ")) | .[0:-1] | map( { "data": { "id": .[0] } }, { "data": { "id": .[1] } }, { "data": { "id": (.[0] + "-" + .[1]), "source": .[0], "target": .[1] } } )' >> cyto/$g.js
  done
done
