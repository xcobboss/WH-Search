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
    const options = {
        threshold: 0.2,  // Adjusted down from 0.4 to require a closer match.
        distance: 50,  // Lowered from 100, making matches need to be closer to the query string.
        location: 0,  
        keys: ['name']
    };
    
    const fuse = new Fuse(wines, options);
    
    return fuse.search(query);
}
