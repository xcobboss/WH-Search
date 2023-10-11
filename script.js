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
        console.log('Wines data loaded:', wines); 
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
    console.log('Search results:', results); 
    
    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }
    
    results.forEach(({item}) => { 
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `<p>${item.name}</p>`;
        resultsDiv.appendChild(resultDiv);
    });
}

function searchWines(query) {
    // Fuse.js options
    const options = {
        threshold: 0.4,  // Tweak the threshold to optimize results.
        location: 0,
        distance: 100,
        keys: ['name']
    };
    
    // Initialize Fuse with the wines data and options
    const fuse = new Fuse(wines, options);
    
    // Perform the search and return the results
    return fuse.search(query);
}
