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
    
    results.forEach(({wine, matchType}) => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `<p>${wine.name} <em>(${matchType})</em></p>`;
        resultsDiv.appendChild(resultDiv);
    });
}

function searchWines(query) {
    const queryTokens = query.split(/\s+/);
    const results = [];

    wines.forEach(wine => {
        if (wine.name.toLowerCase().includes(query)) {
            results.push({wine, matchType: 'exact match'});
        } else {
            const wineTokens = wine.name.toLowerCase().split(/\s+/);
            if (queryTokens.every(token => wineTokens.includes(token))) {
                results.push({wine, matchType: 'token match'});
            } else if (queryTokens.some(token => wine.name.toLowerCase().includes(token) && !/^\d+$/.test(token))) {
                results.push({wine, matchType: 'partial match'});
            }
        }
    });

    return results;
}
