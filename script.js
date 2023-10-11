document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();  // Prevents the default form submission
        search();  // Function that performs the search
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        const query = document.getElementById('searchInput').value;
        document.querySelector('button').disabled = !query.trim();
    });

    document.querySelector('.mobile-search-icon').addEventListener('click', function() {
        document.getElementById('searchForm').submit();
    });

    // Fetch wines from JSON file and initialize Fuse
    fetch('wines.json')
        .then(response => response.json())
        .then(data => {
            wines = data;
            initializeFuse(wines);
        })
        .catch(error => console.error('Fetching error:', error));
});

let wines = [];
let fuse;

function initializeFuse(winesData) {
    const fuseOptions = {
        keys: ['name'],
        includeScore: true,
        threshold: 0.3,  // Lower means stricter matching. Adjust as needed.
        location: 0,  // Indicates approximately where in the text the pattern is expected to be found
        distance: 100  // Determines how close the match must be to the fuzzy location. Higher means farther.
    };
    fuse = new Fuse(winesData, fuseOptions);
}


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
    const fuseResults = fuse.search(query);

    fuseResults.forEach(result => {
        if (result.score <= 0.4) { 
            results.push({
                wine: result.item, 
                matchType: result.score === 0 ? 'exact match' : 'fuzzy match'
            });
        }
    });

    return results;
}
