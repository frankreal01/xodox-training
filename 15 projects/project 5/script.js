const addBookMarkBtn = document.getElementById('add-bookmark');
const bookmarksList = document.getElementById('bookmarks-list');
const bookmarkNameInput = document.getElementById('bookmark-name');
const bookmarkUrlInput = document.getElementById('bookmark-url');

document.addEventListener('DOMContentLoaded', loadBookmark);

addBookMarkBtn.addEventListener('click', function () {
    const name = bookmarkNameInput.value.trim();
    const url = bookmarkUrlInput.value.trim();

    if (!name || !url) {
        alert('Please enter both a name and a URL for your bookmark.');
        return;
    } else {
        if (!url.includes('https://') && !url.includes('http://')) {
            alert('Please enter a valid URL that includes https:// or http://.');
            return;
        }
        addBookMark(name, url);
        saveBookmark(name, url);
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
    }

    function addBookMark(name, url) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = name;
        li.appendChild(link);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            bookmarksList.removeChild(li);
            deleteBookmarkFromStorage(name, url);
        });

        li.appendChild(link);
        li.appendChild(deleteBtn);
        bookmarksList.appendChild(li);

    }

    function getBookmarksFromStorage() {
        const bookmarks = localStorage.getItem('bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    }

    function saveBookmark(name, url) {
        const bookmarks = getBookmarksFromStorage();
        bookmarks.push({ name, url });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    function loadBookmark() {
        const bookmarks = getBookmarksFromStorage();
        bookmarks.forEach(bookmark => {
            addBookMark(bookmark.name, bookmark.url);
        });
    }

    function deleteBookmarkFromStorage(name, url) {
        let bookmarks = getBookmarksFromStorage();
        bookmarks = bookmarks.filter(bookmark => bookmark.name !== name || bookmark.url !== url);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
});
