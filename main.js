const API_URL = "http://localhost:3020/workexperience";  // API URL

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

// Event Listeners
document.getElementById('workexperience-form').addEventListener('submit', addExperience);


// Initiera sidan med att hämta och visa arbetserfarenheter
fetchExperiences();