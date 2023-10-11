let wines = [];

// Fetch wines from JSON file
fetch('wines.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        wines = data;
        console.log('Wines data loaded:', wines); // Debug: check loaded data
    })
    .catch(error => {
        console.error('Fetching error:', error);
    });

function search() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; 
    
    if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    const results = searchWines(query);
    console.log('Search results:', results); // Debug: check search results
    
    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }
    
    results.forEach(({item, score}) => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `<p>${item.name} (Score: ${score.toFixed(2)})</p>`;
        resultsDiv.appendChild(resultDiv);
    });
}

function searchWines(query) {
    const exactMatches = [];
    const tokenMatches = [];
    const fuzzyOptions = {
        includeScore: true,
        threshold: 0.4, 
        distance: 100, 
        keys: ['name']
    };
    const fuse = new Fuse(wines, fuzzyOptions);

    // 1. Exact match
    wines.forEach(wine => {
        if(wine.name.toLowerCase().includes(query)) {
            exactMatches.push({ item: wine, score: 0 });
        }
    });

    if (exactMatches.length > 0) {
        return exactMatches;
    }
    
    // 2. Tokenized search
    const queryTokens = query.split(/\s+/);
    wines.forEach(wine => {
        const wineTokens = wine.name.toLowerCase().split(/\s+/);
        if(queryTokens.some(token => wineTokens.includes(token))) {
            tokenMatches.push({ item: wine, score: 0.2 });
        }
    });

    if (tokenMatches.length > 0) {
        return tokenMatches;
    }
    
    // 3. Fuzzy search
    return fuse.search(query);
}
