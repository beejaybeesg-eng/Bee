SP=${VV_WORK:-$(pwd)}; PY=${PYTHON:-python3}; T=$(cd "$(dirname "$0")" && pwd)
for n in 02 01 04 05 06 07 08 09 10; do
  W=$SP/t$n; cd $W; title=$(python3 -c "import json;print(json.load(open('$T/plans.json'))['$n']['title'])"); pick=$(python3 -c "import json;print(json.load(open('$T/plans.json'))['$n']['pick'])")
  O="$D/${n}_${title//,/}"; mkdir -p "$O"
  for v in A B C; do
    python3 -c "import json;p=json.load(open('$T/plans.json'))['$n'];json.dump({'segments':p['$v'],'fade_out':0.08 if '$v'=='C' else 0.8},open('$W/plan_$v.json','w'))"
    $PY -I $T/cut.py src.mp3 a.json plan_$v.json cut_$v.wav >> $W/log.txt 2>&1
  done
  ffmpeg -v error -y -i cut_A.wav -b:a 320k "$O/${n}_A_结构版.mp3"; ffmpeg -v error -y -i cut_B.wav -b:a 320k "$O/${n}_B_画面版.mp3"; ffmpeg -v error -y -i cut_C.wav -b:a 320k "$O/${n}_C_IG版.mp3"
  $PY -I $T/mapcuts.py map.png a.json $T/plans.json $n "$O/${n}_结构图.png" >> $W/log.txt 2>&1
  VV_BUILD=$SP $PY -I $T/make_demo.py $n a.json cut_$pick.wav "$O/${n}_小样_${pick}版.mp4" "$n $title · 小样 $pick 版 · 画面为分镜图" >> $W/log.txt 2>&1
  echo "done $n $(ls "$O" | wc -l) files"
done
echo ALLDONE
