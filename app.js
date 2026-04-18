/**
 * Darryl's Photo Gallery - Main Application
 * 
 * ============================================================
 * CONFIGURATION
 * ============================================================
 * 
 * BEFORE USING: Create a Firebase project at https://console.firebase.google.com
 * 1. Create a new Firebase project
 * 2. Enable Firestore database (Create in test mode for now)
 * 3. Copy your config from Project Settings > General > Your apps
 * 4. Update the firebaseConfig object below
 * 
 * ============================================================
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX4ErpBVVU8rwXThgyfq4w1hEKxApVHew",
  authDomain: "darryl-gallery.firebaseapp.com",
  projectId: "darryl-gallery",
  storageBucket: "darryl-gallery.firebasestorage.app",
  messagingSenderId: "194275201006",
  appId: "1:194275201006:web:c40cf87f630f8803d408ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Simple password protection (change this!)
// In production, use Firebase Authentication with actual user accounts
const GALLERY_PASSWORD = "darryl2024";

/**
 * ============================================================
 * AUTHENTICATION
 * ============================================================
 * Handles login, logout, and session persistence
 */

class AuthService {
    constructor() {
        this.STORAGE_KEY = 'darryl_gallery_user';
        this.currentUser = null;
    }

    // Check for existing session
    init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                this.currentUser = JSON.parse(stored);
                return true;
            } catch (e) {
                localStorage.removeItem(this.STORAGE_KEY);
            }
        }
        return false;
    }

    // Authenticate user
    login(username, password) {
        // ============================================================
        // BACKEND CALL: Validate credentials
        // ============================================================
        // For simplicity, using client-side password check
        // In production: Use Firebase Auth or your own backend
        // ============================================================
        
        if (password === GALLERY_PASSWORD) {
            this.currentUser = {
                username: username.trim(),
                loginTime: Date.now()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
            return true;
        }
        return false;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.STORAGE_KEY);
    }

    // Get current username
    getUsername() {
        return this.currentUser ? this.currentUser.username : null;
    }

    // Check if logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

/**
 * ============================================================
 * FIREBASE DATABASE SERVICE
 * ============================================================
 * Handles ratings and comments via Firestore
 * 
 * Database Schema:
 * - ratings/{imageId}/{userId}: { value: number, timestamp: number }
 * - comments/{imageId}: [ { username, text, timestamp } ]
 */

class DatabaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    // ============================================================
    // BACKEND CALL: Initialize Firebase
    // ============================================================
    async init() {
        if (this.initialized) return;
        
        try {
            // ============================================================
            // FIREBASE: Initialize app
            // firebase.initializeApp(firebaseConfig);
            // ============================================================
            // UNCOMMENT the line above after setting up Firebase config
            
            // For demo: use mock data if Firebase not configured
            this.initialized = true;
            this.useMockData = true;
            this._initMockData();
            
        } catch (error) {
            console.warn('Firebase not configured, using mock data');
            this.initialized = true;
            this.useMockData = true;
            this._initMockData();
        }
    }

    _initMockData() {
        // Mock storage for demo when Firebase not configured
        this.mockRatings = {};
        this.mockComments = {};
    }

    // ============================================================
    // BACKEND CALL: Get ratings for an image
    // ============================================================
    async getRatings(imageId) {
        if (this.useMockData) {
            return this._getMockRatings(imageId);
        }

        // ============================================================
        // FIREBASE: Query ratings collection
        // const snapshot = await firebase.firestore()
        //     .collection('ratings')
        //     .doc(imageId)
        //     .collection('userRatings')
        //     .get();
        // ============================================================
    }

    _getMockRatings(imageId) {
        if (!this.mockRatings[imageId]) {
            this.mockRatings[imageId] = {
                total: 0,
                count: 0,
                userRatings: {}
            };
        }
        
        const data = this.mockRatings[imageId];
        const ratings = Object.values(data.userRatings).map(r => r.value);
        const avg = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
            : 0;
        
        return {
            average: avg,
            count: data.count,
            userRatings: data.userRatings
        };
    }

    // ============================================================
    // BACKEND CALL: Submit rating for an image
    // ============================================================
    async submitRating(imageId, userId, value) {
        if (this.useMockData) {
            return this._submitMockRating(imageId, userId, value);
        }

        // ============================================================
        // FIREBASE: Set user rating
        // await firebase.firestore()
        //     .collection('ratings')
        //     .doc(imageId)
        //     .collection('userRatings')
        //     .doc(userId)
        //     .set({
        //         value: value,
        //         timestamp: Date.now()
        //     });
        // ============================================================
    }

    _submitMockRating(imageId, userId, value) {
        if (!this.mockRatings[imageId]) {
            this._initMockData();
            this.mockRatings[imageId] = {
                total: 0,
                count: 0,
                userRatings: {}
            };
        }
        
        const data = this.mockRatings[imageId];
        const oldValue = data.userRatings[userId]?.value || 0;
        
        data.userRatings[userId] = { value, timestamp: Date.now() };
        data.count = Object.keys(data.userRatings).length;
        
        return { success: true };
    }

    // ============================================================
    // BACKEND CALL: Get comments for an image
    // ============================================================
    async getComments(imageId) {
        if (this.useMockData) {
            return this._getMockComments(imageId);
        }

        // ============================================================
        // FIREBASE: Query comments collection
        // const snapshot = await firebase.firestore()
        //     .collection('comments')
        //     .doc(imageId)
        //     .collection('userComments')
        //     .orderBy('timestamp', 'desc')
        //     .get();
        // ============================================================
    }

    _getMockComments(imageId) {
        if (!this.mockComments[imageId]) {
            this.mockComments[imageId] = [];
        }
        return [...this.mockComments[imageId]].reverse();
    }

    // ============================================================
    // BACKEND CALL: Submit comment for an image
    // ============================================================
    async submitComment(imageId, username, text) {
        if (this.useMockData) {
            return this._submitMockComment(imageId, username, text);
        }

        // ============================================================
        // FIREBASE: Add comment
        // await firebase.firestore()
        //     .collection('comments')
        //     .doc(imageId)
        //     .collection('userComments')
        //     .add({
        //         username: username,
        //         text: text,
        //         timestamp: Date.now()
        //     });
        // ============================================================
    }

    _submitMockComment(imageId, username, text) {
        if (!this.mockComments[imageId]) {
            this.mockComments[imageId] = [];
        }
        
        this.mockComments[imageId].push({
            username,
            text,
            timestamp: Date.now()
        });
        
        return { success: true };
    }
}

/**
 * ============================================================
 * APPLICATION CONTROLLER
 * ============================================================
 */

class GalleryApp {
    constructor() {
        this.auth = new AuthService();
        this.db = new DatabaseService();
        this.currentImageId = null;
        this.currentUserRating = null;
    }

    async init() {
        await this.db.init();
        
        this.bindEvents();
        
        if (this.auth.init()) {
            this.showGallery();
        } else {
            this.showLogin();
        }
    }

    bindEvents() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Gallery items (event delegation)
        document.getElementById('gallery-grid')?.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                this.openLightbox(item.dataset.imageId);
            }
        });

        // Lightbox close
        document.getElementById('lightbox-close')?.addEventListener('click', () => {
            this.closeLightbox();
        });

        document.getElementById('lightbox')?.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });

        // Star rating
        document.getElementById('star-rating')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                this.handleRating(parseInt(e.target.dataset.value));
            }
        });

        // Comment form
        document.getElementById('comment-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleComment();
        });
    }

    showLogin() {
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('gallery-screen').classList.remove('active');
    }

    showGallery() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('gallery-screen').classList.add('active');
        document.getElementById('user-badge').textContent = `Logged in as ${this.auth.getUsername()}`;
        this.loadAllRatings();
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('login-error');
        
        if (!username || !password) {
            return;
        }

        if (this.auth.login(username, password)) {
            errorEl.classList.add('hidden');
            this.showGallery();
        } else {
            errorEl.classList.remove('hidden');
        }
    }

    handleLogout() {
        this.auth.logout();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        this.showLogin();
    }

    async loadAllRatings() {
        const imageIds = ['darryl-1', 'darryl-2', 'darryl-3', 'darryl-4', 'darryl-5', 'darryl-6'];
        
        for (const imageId of imageIds) {
            const ratings = await this.db.getRatings(imageId);
            this.updateGalleryRating(imageId, ratings);
        }
    }

    updateGalleryRating(imageId, ratings) {
        const item = document.querySelector(`.gallery-item[data-image-id="${imageId}"] .avg-rating`);
        if (!item) return;

        const avg = ratings.average.toFixed(1);
        const count = ratings.count;
        
        item.dataset.rating = avg;
        
        const starsEl = item.querySelector('.stars');
        const countEl = item.querySelector('.rating-count');
        
        starsEl.textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
        countEl.textContent = `(${count})`;
    }

    async openLightbox(imageId) {
        this.currentImageId = imageId;
        
        // Show placeholder in lightbox
        const placeholder = document.querySelector(`.gallery-item[data-image-id="${imageId}"] .image-placeholder`);
        const lightboxImage = document.getElementById('lightbox-image');
        const imageContainer = document.querySelector('.lightbox-image-container');
        
        if (placeholder && lightboxImage) {
            // Reset to placeholder display
            const bg = placeholder.style.background || 'linear-gradient(135deg, #2d3436, #636e72)';
            imageContainer.innerHTML = `
                <div class="lightbox-image-placeholder" style="${bg}; aspect-ratio: 4/3;">
                    <span>${imageId.replace('darryl-', 'Photo ')}</span>
                    <small>Replace with actual Darryl photo</small>
                </div>
            `;
        }
        
        const title = imageId.replace('darryl-', 'Photo ');
        document.getElementById('lightbox-title').textContent = title;
        
        // Load ratings
        await this.loadLightboxRating(imageId);
        
        // Load comments
        await this.loadLightboxComments(imageId);
        
        // Show lightbox
        document.getElementById('lightbox').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        document.getElementById('lightbox').classList.add('hidden');
        document.body.style.overflow = '';
        this.currentImageId = null;
        this.currentUserRating = null;
    }

    async loadLightboxRating(imageId) {
        const ratings = await this.db.getRatings(imageId);
        const username = this.auth.getUsername();
        
        // Update average display
        document.getElementById('avg-rating-display').textContent = ratings.average.toFixed(1);
        document.getElementById('rating-count-display').textContent = ratings.count;
        
        // Update user's own rating
        const yourRatingEl = document.getElementById('your-rating');
        this.currentUserRating = ratings.userRatings[username]?.value || null;
        
        if (this.currentUserRating) {
            yourRatingEl.querySelector('span').textContent = `${this.currentUserRating} ★`;
            yourRatingEl.classList.remove('hidden');
        } else {
            yourRatingEl.classList.add('hidden');
        }
        
        // Update star display
        this.updateStarDisplay(this.currentUserRating || 0);
    }

    updateStarDisplay(rating) {
        const stars = document.querySelectorAll('#star-rating .star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    async handleRating(value) {
        if (!this.currentImageId) return;
        
        const username = this.auth.getUsername();
        await this.db.submitRating(this.currentImageId, username, value);
        
        this.currentUserRating = value;
        this.updateStarDisplay(value);
        
        // Show user's rating
        const yourRatingEl = document.getElementById('your-rating');
        yourRatingEl.querySelector('span').textContent = `${value} ★`;
        yourRatingEl.classList.remove('hidden');
        
        // Reload ratings
        await this.loadLightboxRating(this.currentImageId);
        await this.loadAllRatings();
    }

    async loadLightboxComments(imageId) {
        const comments = await this.db.getComments(imageId);
        const listEl = document.getElementById('comments-list');
        
        if (!comments || comments.length === 0) {
            listEl.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
            return;
        }
        
        listEl.innerHTML = comments.map(c => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${this.escapeHtml(c.username)}</span>
                    <span class="comment-time">${this.formatTime(c.timestamp)}</span>
                </div>
                <p class="comment-text">${this.escapeHtml(c.text)}</p>
            </div>
        `).join('');
    }

    async handleComment() {
        if (!this.currentImageId) return;
        
        const textarea = document.getElementById('comment-text');
        const text = textarea.value.trim();
        
        if (!text) return;
        
        const username = this.auth.getUsername();
        await this.db.submitComment(this.currentImageId, username, text);
        
        textarea.value = '';
        
        // Reload comments
        await this.loadLightboxComments(this.currentImageId);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }
}

// Initialize app when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new GalleryApp();
    app.init();
});
