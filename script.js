let wines = [];

// Fetch wines from JSON file
fetch('wines.json')
    .then(response => response.json())
    .then(data => {
        wines = data;
        initializeFuse();
    })
    .catch(error => console.error('Fetching error:', error));

let fuse;  // Declare fuse variable globally

// Initialize Fuse with wines data
function initializeFuse() {
const fuseOptions = {
    keys: [
        { name: 'name', weight: 0.7 },
        { name: 'name', weight: 0.3 }
    ],
    includeScore: true,
    threshold: 0.3, // Try making it slightly stricter
    location: 0, // Start at the beginning of the string
    distance: 9, // Look for matches in the first 50 characters
    minMatchCharLength: 3, 
    shouldSort: true,
    findAllMatches: true,
    includeMatches: true
};


    fuse = new Fuse(wines, fuseOptions);
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  
        search();
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

    const results = fuse.search(query);  // Utilizing Fuse.js for searching

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }
    
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `<p>${result.item.name} <em>(Score: ${result.score.toFixed(2)})</em></p>`;
        resultsDiv.appendChild(resultDiv);
    });
}
