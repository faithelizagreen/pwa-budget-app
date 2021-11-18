const request = window.indexedDB.open("budgetTracker", 1);

// Create schema
request.onupgradeneeded = event => {
    const db = event.target.result;

    db.createObjectStore('newTransaction', {
        autoincrement: true
    });

};

// Checks if app is online, if yes run addTransactio.
request.onsuccess = event => {
    db = event.target.results;

    if (navigator.onLine) {
        addTransaction()
// if offline saveTransaction()
    } else {
        saveTransaction()
    }
};

function saveTransaction(record) {

    const transaction = db.transaction('[newTransaction]', 'readWrite')
    const budgetObjectStore = transaction.objectStore('newTransaction')

    budgetObjectStore.add(record)
}

function addTransaction() {

    
    const transaction = db.transaction(['newTransaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('newTransaction');

   
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {


        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                 
                    const transaction = db.transaction(['newTransaction'], 'readwrite');

                
                    const budgetObjectStore = transaction.objectStore('newTransaction');

            
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

// listen for app coming back online
window.addEventListener('online', addTransaction);