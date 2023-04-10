import requests

url = "https://github.com/silkrow/chess-openings-database/raw/master/a.tsv"
filename = "a.tsv"

response = requests.get(url)

if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file" + filename)

url = "https://github.com/silkrow/chess-openings-database/raw/master/b.tsv"
filename = "b.tsv"

response = requests.get(url)

if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file" + filename)

url = "https://github.com/silkrow/chess-openings-database/raw/master/c.tsv"
filename = "c.tsv"

response = requests.get(url)

if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file" + filename)

url = "https://github.com/silkrow/chess-openings-database/raw/master/d.tsv"
filename = "d.tsv"

response = requests.get(url)

if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file" + filename)

url = "https://github.com/silkrow/chess-openings-database/raw/master/e.tsv"
filename = "e.tsv"

response = requests.get(url)

if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file" + filename)


