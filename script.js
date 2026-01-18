// 1. Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTable();
    setupSearch();
});

function initTable() {
    const table = document.getElementById('periodic-table');
    if (!table) return;
    table.innerHTML = '';

    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 18; col++) {
            const element = elements.find(e => e.row === row && e.col === col);
            if (element) {
                table.appendChild(createElementCell(element));
            } else {
                const div = document.createElement('div');
                if (row === 6 && col === 3) div.textContent = "*";
                if (row === 7 && col === 3) div.textContent = "**";
                div.className = "flex items-center justify-center text-gray-600 font-bold opacity-30";
                table.appendChild(div);
            }
        }
    }
}

// 2. Element Cell Creation
function createElementCell(el) {
    const cell = document.createElement('div');
    cell.className = `element-cell category-${el.category} rounded-lg p-2 flex flex-col items-center justify-between text-center`;
    
    let stateClass = 'text-white'; 
    if (el.state === 'Gas') stateClass = 'text-red-300';
    if (el.state === 'Liquid') stateClass = 'text-blue-300';
    if (el.state === 'Unknown') stateClass = 'text-gray-400';

    cell.innerHTML = `
        <span class="text-[9px] w-full text-left opacity-80 font-mono">${el.number}</span>
        <span class="text-lg font-black tracking-tighter ${stateClass}">${el.symbol}</span>
        <span class="text-[8px] uppercase font-bold truncate w-full">${el.name}</span>
    `;
    
    cell.onclick = () => showElementModal(el);
    cell.dataset.category = el.category;
    return cell;
}

// 3. Search & Filtering Logic
function setupSearch() {
    const searchInput = document.getElementById('elementSearch');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.element-cell').forEach(cell => {
            const isMatch = cell.innerText.toLowerCase().includes(query);
            cell.classList.toggle('hidden-element', !isMatch);
        });
    });
}

function filterElements(category) {
    document.querySelectorAll('.element-cell').forEach(cell => {
        const isMatch = category === 'all' || cell.dataset.category === category;
        cell.classList.toggle('hidden-element', !isMatch);
    });
}

// 4. Detailed Information Modal
function showElementModal(el) {
    const modal = document.getElementById('element-modal');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div>
                <h2 class="text-4xl font-black text-white">${el.name}</h2>
                <p class="text-blue-400 font-bold uppercase tracking-widest text-sm">${el.category}</p>
            </div>
            <button onclick="closeModal('element-modal')" class="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                <p class="text-gray-500 uppercase text-[10px]">Atomic Mass</p>
                <p class="text-lg font-mono text-white">${el.mass} u</p>
            </div>
            <div class="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                <p class="text-gray-500 uppercase text-[10px]">State at STP</p>
                <p class="text-lg text-white">${el.state}</p>
            </div>
            <div class="col-span-2 bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                <p class="text-gray-500 uppercase text-[10px]">Electron Configuration</p>
                <p class="text-md font-mono text-blue-300">${el.electron}</p>
            </div>
        </div>
        <p class="mt-6 text-gray-400 text-sm italic">Discovered in ${el.discovered} by ${el.discoverer}</p>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// 5. Automated Quiz Logic
function showQuiz() {
    const modal = document.getElementById('quiz-modal');
    const content = document.getElementById('quiz-content');
    const target = elements[Math.floor(Math.random() * elements.length)];
    
    // Distractors
    const options = [target.name];
    while(options.length < 4) {
        let randomName = elements[Math.floor(Math.random() * elements.length)].name;
        if(!options.includes(randomName)) options.push(randomName);
    }
    options.sort(() => Math.random() - 0.5);

    content.innerHTML = `
        <h3 class="text-xl font-bold mb-4 text-center">Which element has the symbol <span class="text-blue-400 text-2xl">${target.symbol}</span>?</h3>
        <div class="grid grid-cols-1 gap-3">
            ${options.map(opt => `
                <button onclick="checkAnswer('${opt}', '${target.name}')" 
                        class="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition font-bold">
                    ${opt}
                </button>
            `).join('')}
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function checkAnswer(selected, correct) {
    if(selected === correct) {
        alert("Correct!");
        showQuiz(); // Load next question
    } else {
        alert(`Wrong! The correct answer was ${correct}.`);
        closeModal('quiz-modal');
    }
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}