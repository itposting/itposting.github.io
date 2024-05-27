# generate-sitemap.sh

ls

# 정적 sitemap 생성
echo "정적 sitemap 생성중.."
node scripts/sitemap.js
echo "정적 sitemap 생성 완료!"

# Google 서치콘솔에 sitemap 업데이트 핑 전송
curl http://google.com/ping?sitemap=https://itposting.github.io/sitemap.xml
# echo "Google에 sitemap 핑 전송"