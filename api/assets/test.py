import requests

url = "http://your-domain.com/path-to-script.php"
data = {
    "ip": "192.168.1.100",
    "key": "1cae5b12ba060bc5",
    "action": "check_key"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
