const addBookMarkBtn = document.getElementById('add-bookmark');
const bookmarksList = document.getElementById('bookmarks-list');
const bookmarkNameInput = document.getElementById('bookmark-name');
const bookmarkUrlInput = document.getElementById('bookmark-url');
const storageKey = 'bookmarks';

function getBookmarksFromStorage() {
    try {
        const bookmarks = JSON.parse(localStorage.getItem(storageKey));

        if (!Array.isArray(bookmarks)) {
            return [];
        }

        return bookmarks
            .filter((bookmark) => typeof bookmark.name === 'string' && typeof bookmark.url === 'string')
            .map((bookmark) => ({
                ...bookmark,
                id: bookmark.id || `${bookmark.name}-${bookmark.url}`
            }));
    } catch {
        return [];
    }
}

function saveBookmarks(bookmarks) {
    localStorage.setItem(storageKey, JSON.stringify(bookmarks));
}

function addBookmarkToPage(bookmark) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const deleteBtn = document.createElement('button');

    link.href = bookmark.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = bookmark.name;

    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        const bookmarks = getBookmarksFromStorage().filter((savedBookmark) =>
            savedBookmark.id !== bookmark.id
        );

        saveBookmarks(bookmarks);
        item.remove();
    });

    item.append(link, deleteBtn);
    bookmarksList.appendChild(item);
}

function loadBookmarks() {
    bookmarksList.innerHTML = '';
    getBookmarksFromStorage().forEach(addBookmarkToPage);
}

function normaliseUrl(url) {
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function addBookmark() {
    const name = bookmarkNameInput.value.trim();
    const url = normaliseUrl(bookmarkUrlInput.value.trim());

    if (!name || !bookmarkUrlInput.value.trim()) {
        alert('Please enter both a bookmark name and URL.');
        return;
    }

    try {
        new URL(url);
    } catch {
        alert('Please enter a valid website address.');
        return;
    }

    const bookmark = {
        id: Date.now().toString(),
        name,
        url
    };

    const bookmarks = getBookmarksFromStorage();
    bookmarks.push(bookmark);
    saveBookmarks(bookmarks);
    addBookmarkToPage(bookmark);

    bookmarkNameInput.value = '';
    bookmarkUrlInput.value = '';
    bookmarkNameInput.focus();
}

addBookMarkBtn.addEventListener('click', addBookmark);

bookmarkUrlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addBookmark();
    }
});

loadBookmarks();
