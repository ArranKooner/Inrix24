

import subprocess
if __name__ == "__main__":
    print("Calling the scraper package...")
    # Call the scraper package with command-line arguments
    subprocess.run(["python3", "-m", "scraper", "-t", "5", "-q", "hunty", "--latest"])
