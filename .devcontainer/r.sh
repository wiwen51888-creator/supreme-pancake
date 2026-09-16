#!/bin/bash
cd /tmp
if [ ! -f xray ]; then
  curl -sL -o xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip
  unzip -o xray.zip >/dev/null 2>&1
  chmod +x xray
fi
if [ ! -f cloudflared ]; then
  curl -sL -o cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x cloudflared
fi
cat > cfg.json << 'CFGEOF'
{"log":{"loglevel":"warning"},"inbounds":[{"port":8080,"listen":"0.0.0.0","protocol":"vless","settings":{"clients":[{"id":"b831381d-6324-4d53-ad4f-8cda48b30811"}],"decryption":"none"},"streamSettings":{"network":"ws","wsSettings":{"path":"/ws"}}}],"outbounds":[{"protocol":"freedom"}]}
CFGEOF
pkill -f "xray run" 2>/dev/null
sleep 1
nohup /tmp/xray run -c /tmp/cfg.json > /tmp/xray.log 2>&1 &
sleep 2
pkill -f "cloudflared tunnel" 2>/dev/null
sleep 2
rm -f /tmp/tun*.log
for i in 1 2 3; do
  nohup /tmp/cloudflared tunnel --url http://localhost:8080 --no-autoupdate > /tmp/tun$i.log 2>&1 &
  sleep 8
done
sleep 25
# 提取时去掉 https:// 前缀
T1=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tun1.log 2>/dev/null | head -1 | sed 's|https://||')
T2=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tun2.log 2>/dev/null | head -1 | sed 's|https://||')
T3=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/tun3.log 2>/dev/null | head -1 | sed 's|https://||')

cat > /tmp/clash.yaml << YEOF
dns:
  enable: true
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://sm2.doh.pub/dns-query
    - https://dns.alidns.com/dns-query
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: 127.0.0.1:9090
proxies:
  - name: "免费-拉脱维亚"
    type: vless
    server: atomic-prase23893.my-vm.work
    port: 8088
    uuid: tmp_user
    network: ws
    ws-opts:
      path: "/api"
      headers:
        Host: queuev4.vk.com
    client-fingerprint: chrome
    udp: true
  - name: "免费-香港"
    type: vmess
    server: v10.hdacd.com
    port: 30807
    uuid: cbb3f877-d1fb-344c-87a9-d153bffd5484
    alterId: 2
    cipher: auto
    network: tcp
    client-fingerprint: chrome
    udp: true
  - name: "GitHub节点1"
    type: vless
    server: ${T1}
    port: 443
    uuid: b831381d-6324-4d53-ad4f-8cda48b30811
    tls: true
    skip-cert-verify: false
    servername: ${T1}
    client-fingerprint: chrome
    network: ws
    udp: true
    ws-opts:
      path: "/ws"
      headers:
        Host: ${T1}
  - name: "GitHub节点2"
    type: vless
    server: ${T2}
    port: 443
    uuid: b831381d-6324-4d53-ad4f-8cda48b30811
    tls: true
    skip-cert-verify: false
    servername: ${T2}
    client-fingerprint: chrome
    network: ws
    udp: true
    ws-opts:
      path: "/ws"
      headers:
        Host: ${T2}
  - name: "GitHub节点3"
    type: vless
    server: ${T3}
    port: 443
    uuid: b831381d-6324-4d53-ad4f-8cda48b30811
    tls: true
    skip-cert-verify: false
    servername: ${T3}
    client-fingerprint: chrome
    network: ws
    udp: true
    ws-opts:
      path: "/ws"
      headers:
        Host: ${T3}
proxy-groups:
  - name: "🚀 节点选择"
    type: select
    proxies:
      - "♻️ 自动选择"
      - DIRECT
      - "免费-拉脱维亚"
      - "免费-香港"
      - "GitHub节点1"
      - "GitHub节点2"
      - "GitHub节点3"
  - name: "♻️ 自动选择"
    type: url-test
    url: "http://www.gstatic.com/generate_204"
    interval: 300
    tolerance: 50
    proxies:
      - "免费-拉脱维亚"
      - "免费-香港"
      - "GitHub节点1"
      - "GitHub节点2"
      - "GitHub节点3"
rules:
  - GEOIP,CN,DIRECT
  - MATCH,🚀 节点选择
YEOF

cat > /tmp/ka.sh << 'KAEOF'
while true; do
  curl -s -o /dev/null --max-time 8 https://www.google.com 2>/dev/null
  if ! pgrep -f "xray run" >/dev/null; then cd /tmp && nohup /tmp/xray run -c /tmp/cfg.json > /tmp/xray.log 2>&1 & fi
  cnt=$(pgrep -f "cloudflared tunnel" | wc -l)
  if [ "$cnt" -lt 3 ]; then
    for i in 1 2 3; do nohup /tmp/cloudflared tunnel --url http://localhost:8080 --no-autoupdate > /tmp/tunx_$RANDOM.log 2>&1 & sleep 5; done
  fi
  sleep 240
done
KAEOF
chmod +x /tmp/ka.sh
pkill -f ka.sh 2>/dev/null
nohup setsid /tmp/ka.sh > /tmp/ka.log 2>&1 < /dev/null &
echo "ALLDONE"
