document.addEventListener('DOMContentLoaded', () => {
    let wines = [];

    // Fetch wines from JSON file
    fetch('wines.json')
        .then(response => response.json())
        .then(data => {
            wines = data;
            initializeSearch(wines);
        })
        .catch(error => console.error('Fetching error:', error));

    function initializeSearch(wines) {
        const fuseOptions = {
            keys: ['name'],
            includeScore: true,
            threshold: 0.1, 
            location: 0,
            distance: 100,
            minMatchCharLength: 3,
            limit: 5 
        };

        const fuse = new Fuse(wines, fuseOptions);

        document.getElementById('searchForm').addEventListener('submit', function (event) {
            event.preventDefault();
            search();
        });

        document.getElementById('searchInput').addEventListener('input', function () {
            const query = document.getElementById('searchInput').value;
            document.querySelector('button').disabled = !query.trim();
        });

        document.querySelector('.mobile-search-icon').addEventListener('click', function () {
            document.getElementById('searchForm').submit();
        });

        function search() {
            const query = document.getElementById('searchInput').value;
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ""; 

            if (!query) {
                resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
                return;
            }

            const results = fuse.search(query).sort((a, b) => b.score - a.score); // Sorting by score

            if (results.length === 0) {
                resultsDiv.innerHTML = "<p>No results found.</p>";
                return;
            }
            
            results.forEach(({ item, score }) => {
                const resultDiv = document.createElement('div');
                resultDiv.innerHTML = `<p>${item.name} <em>(score: ${score.toFixed(2)})</em></p>`;
                resultsDiv.appendChild(resultDiv);
            });
        }
    }
});
