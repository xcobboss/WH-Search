let wines = [];

// Fetch wines from JSON file
fetch('wines.json')
    .then(response => response.json())
    .then(data => {
        wines = data;
    })
    .catch(error => console.error('Fetching error:', error));

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevents the default form submission
        search();  // Your function that performs the search
    });
});

document.getElementById('searchInput').addEventListener('input', function() {
    const query = document.getElementById('searchInput').value;
    document.querySelector('button').disabled = !query.trim();
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.mobile-search-icon').addEventListener('click', function() {
        document.getElementById('searchForm').submit();
    });
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
    const results = [];

    // Exact Match
    wines.forEach(wine => {
        const wineLower = wine.name.toLowerCase();
        if (query === wineLower) {
            results.push({wine, matchType: 'exact match'});
        }
    });
    
    // Token Match
    wines.forEach(wine => {
        const wineTokens = wine.name.toLowerCase().split(/\s+/);
        const queryTokens = query.split(/\s+/);

        if (queryTokens.every(token => wineTokens.includes(token))) {
            if (!results.find(result => result.wine.name === wine.name)) {
                results.push({wine, matchType: 'token match'});
            }
        }
    });

    // Fuzzy Match using Jaro-Winkler similarity
    wines.forEach(wine => {
        const wineLower = wine.name.toLowerCase();

        const similarity = stringSimilarity.compareTwoStrings(query, wineLower);
        if (similarity > 0.8) {  // Adjust similarity threshold as needed
            if (!results.find(result => result.wine.name === wine.name)) {
                results.push({wine, matchType: 'fuzzy match'});
            }
        }
    });

    return results;
}

