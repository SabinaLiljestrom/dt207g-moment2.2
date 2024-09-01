const API_URL = "http://localhost:3020/workexperience";  // API URL

document.addEventListener("DOMContentLoaded", function() {
    // Kontrollera om vi är på sidan med formuläret
    const form = document.getElementById('workexperience-form');
    if (form) {
        form.addEventListener('submit', addExperience);
    }

    // Kontrollera om vi är på sidan med listan över arbetserfarenheter
    if (document.getElementById('list')) {
        fetchExperiences();
    }
});

// Funktion för att hämta och visa arbetserfarenheter
async function fetchExperiences() {
    const response = await fetch(API_URL);
    const result = await response.json();

    console.log(result);  // Kontrollera vad API:et returnerar

    const workexperiences = result.data || [];  // Använd 'data' om det finns, annars en tom array

    const list = document.getElementById('list');
    list.innerHTML = ''; // Rensa listan

    workexperiences.forEach(workexperience => {
        const li = document.createElement('li');
        li.textContent = `${workexperience.companyname} - ${workexperience.jobtitle}, ${workexperience.description}, ${workexperience.location} (${workexperience.startdate} - ${workexperience.enddate || "Pågående"})`;

        // Skapa raderingsknappen
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Radera';
        deleteButton.style.marginLeft = '10px';

        // Lägg till en eventlistener för att radera arbetserfarenheten
        deleteButton.addEventListener('click', async () => {
            if (confirm(`Är du säker på att du vill radera ${workexperience.companyname}?`)) {
                await deleteExperience(workexperience.id);
                fetchExperiences(); // Uppdatera listan efter radering
            }
        });

        // Lägg till knappen i listobjektet
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}

// Funktion för att lägga till ny arbetserfarenhet
async function addExperience(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const experienceData = Object.fromEntries(formData);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceData)
    });

    if (response.ok) {
        fetchExperiences(); // Uppdatera listan efter tillägg
        event.target.reset(); // Rensa formuläret
    } else {
        console.error('Failed to add experience');
    }
}

// Funktion för att radera arbetserfarenhet
async function deleteExperience(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('Experience deleted successfully');
    } else {
        console.error('Failed to delete experience');
    }
}
