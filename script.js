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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.mobile-search-icon').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent any default actions
        search();  // Directly call your search function
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
    const queryTokens = query.split(/\s+/);
    const results = [];

    // Exact Match
    wines.forEach(wine => {
        const wineLower = wine.name.toLowerCase();
        const wineTokens = wineLower.split(/\s+/);
        
        if (query === wineLower || wineTokens.includes(query)) {
            results.push({wine, matchType: 'exact match'});
        }
    });
    
    // Token Match
    wines.forEach(wine => {
        const wineTokens = wine.name.toLowerCase().split(/\s+/);

        if (queryTokens.every(token => wineTokens.includes(token))) {
            if (!results.find(result => result.wine.name === wine.name)) {
                results.push({wine, matchType: 'token match'});
            }
        }
    });

    // Fuzzy Match
    wines.forEach(wine => {
        const wineLower = wine.name.toLowerCase();
        
        // Using String Similarity - Simplistic approach for JS
        const similarity = getSimilarity(query, wineLower);
        if (similarity > 0.1) {  // Adjust similarity threshold as needed
            if (!results.find(result => result.wine.name === wine.name)) {
                results.push({wine, matchType: 'fuzzy match'});
            }
        }
    });

    return results;
}

// A simplistic string similarity function
function getSimilarity(str1, str2) {
    let longer = str1;
    let shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - getEditDistance(longer, shorter)) / parseFloat(longerLength);
}

// A function to get string edit distance using Levenshtein Distance Algorithm
function getEditDistance(a, b) {
    //... implementation here ...
}
