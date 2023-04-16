import requests
import pandas as pd

# Download and save a.tsv
url = "https://github.com/silkrow/chess-openings-database/raw/master/a.tsv"
filename = "a.tsv"
response = requests.get(url)
if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file " + filename)

# Download and save b.tsv
url = "https://github.com/silkrow/chess-openings-database/raw/master/b.tsv"
filename = "b.tsv"
response = requests.get(url)
if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file " + filename)

# Download and save c.tsv
url = "https://github.com/silkrow/chess-openings-database/raw/master/c.tsv"
filename = "c.tsv"
response = requests.get(url)
if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file " + filename)

# Download and save d.tsv
url = "https://github.com/silkrow/chess-openings-database/raw/master/d.tsv"
filename = "d.tsv"
response = requests.get(url)
if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file " + filename)

# Download and save e.tsv
url = "https://github.com/silkrow/chess-openings-database/raw/master/e.tsv"
filename = "e.tsv"
response = requests.get(url)
if response.status_code == 200:
    with open(filename, 'wb') as f:
        f.write(response.content)
    print(f"File saved as {filename}")
else:
    print("Error downloading file " + filename)

# Create all.tsv and write the header from a.tsv
all_filename = "all.tsv"
with open(all_filename, "w") as all_file:
    with open("a.tsv", "r") as a_file:
        header = a_file.readline()
        all_file.write(header)

    # Append content from the remaining four TSV files to all.tsv
    for file_name in ["a.tsv", "b.tsv", "c.tsv", "d.tsv", "e.tsv"]:
        with open(file_name, "r") as file:
            next(file) # skip the header
            for line in file:
                all_file.write(line)

print(f"All files saved as {all_filename}")

# Append an index column
# Read the TSV file into a pandas DataFrame
df = pd.read_csv(all_filename, sep='\t')

# Add a new column for the index
df.insert(0, 'Index', range(len(df)))

# Save the DataFrame back to a TSV file
df.to_csv(all_filename, sep='\t', index=False)
