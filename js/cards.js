async function LoadCards() {
    try {
        const response = await fetch('../components/cards.html');
        if (!response.ok) throw new Error(` status: ${response.status}`);
        const cardContent = await response.text();
        document.getElementById('cardContainer').innerHTML = cardContent;
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}
window.addEventListener('DOMContentLoaded', LoadCards);