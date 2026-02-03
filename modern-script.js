// Modern site navigation script

// MyMini Configuration - Add your deployed MyMini URL here
// Examples: 'https://mymini.vercel.app' or 'https://ishanbrar.github.io/MyMini'
const MYMINI_URL = 'https://mymini-sikhomode.vercel.app/'; // MyMini deployed site

document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation link clicks (including brand link)
    const navLinks = document.querySelectorAll('.nav-link[data-section], .nav-brand[data-section]');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
                
                // Update URL hash without scrolling
                history.pushState(null, null, `#${targetSection}`);
                
                // Focus terminal input if returning to home
                if (targetSection === 'home') {
                    focusTerminalInput();
                } else if (targetSection === 'legacy') {
                    focusLegacyTerminalInput();
                }
            }
        });
    });

    // Handle hash changes (back/forward buttons)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const target = document.getElementById(hash);
            if (target) {
                target.classList.add('active');
                if (hash === 'home') {
                    focusTerminalInput();
                } else if (hash === 'legacy') {
                    focusLegacyTerminalInput();
                }
            }
        } else {
            // Show home section if no hash
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('home').classList.add('active');
            focusTerminalInput();
        }
    });

    // Check initial hash on load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        sections.forEach(section => {
            section.classList.remove('active');
        });
            const target = document.getElementById(hash);
            if (target) {
                target.classList.add('active');
                if (hash === 'home') {
                    focusTerminalInput();
                } else if (hash === 'legacy') {
                    focusLegacyTerminalInput();
                }
            } else {
            document.getElementById('home').classList.add('active');
            focusTerminalInput();
        }
    }

    // Add active state to nav links
    function updateActiveNav() {
        const currentHash = window.location.hash.substring(1) || 'home';
        navLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            if (section === currentHash) {
                link.style.color = 'var(--accent)';
            } else {
                link.style.color = '';
            }
        });
    }

    window.addEventListener('hashchange', updateActiveNav);
    updateActiveNav();

    // Function to focus terminal input (optimized for mobile)
    function focusTerminalInput() {
        const homeTerminalInput = document.getElementById('home-terminal-input');
        if (homeTerminalInput) {
            // Use requestAnimationFrame for better mobile performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    homeTerminalInput.focus();
                    // On mobile, also trigger click to ensure keyboard opens
                    if (window.innerWidth <= 768) {
                        homeTerminalInput.click();
                        // Ensure input is visible and scroll into view on mobile
                        homeTerminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 200);
            });
        }
    }

    // Focus input when home section becomes active
    const homeSection = document.getElementById('home');
    if (homeSection) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (homeSection.classList.contains('active')) {
                        focusTerminalInput();
                    }
                }
            });
        });
        observer.observe(homeSection, { attributes: true });
    }

    // Focus input on initial load if home is active
    if (homeSection && homeSection.classList.contains('active')) {
        focusTerminalInput();
    }

    // Mobile optimization: Make input lines tappable and focus inputs
    function setupTerminalWindowFocus() {
        const homeSection = document.getElementById('home');
        const legacySection = document.getElementById('legacy');
        
        // Home input line click/touch handler
        const homeInputLine = document.getElementById('home-input-line');
        if (homeInputLine) {
            homeInputLine.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const input = document.getElementById('home-terminal-input');
                if (input) {
                    input.focus();
                    // On mobile, ensure keyboard opens
                    if (window.innerWidth <= 768) {
                        input.click();
                    }
                }
            }, { passive: false });
            
            homeInputLine.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const input = document.getElementById('home-terminal-input');
                if (input) {
                    input.focus();
                    input.click();
                }
            }, { passive: false });
        }
        
        // Legacy input line click/touch handler
        const legacyInputLine = document.getElementById('legacy-input-line');
        if (legacyInputLine) {
            legacyInputLine.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const input = document.getElementById('legacy-terminal-input');
                if (input) {
                    input.focus();
                    if (window.innerWidth <= 768) {
                        input.click();
                    }
                }
            }, { passive: false });
            
            legacyInputLine.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const input = document.getElementById('legacy-terminal-input');
                if (input) {
                    input.focus();
                    input.click();
                }
            }, { passive: false });
        }
        
        // Also handle terminal window taps (fallback)
        if (homeSection) {
            const homeTerminalWindow = homeSection.querySelector('.terminal-window');
            if (homeTerminalWindow) {
                homeTerminalWindow.addEventListener('touchend', function(e) {
                    // Only if not clicking on a link/button and not on input line
                    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && 
                        !e.target.closest('a') && !e.target.closest('#home-input-line')) {
                        const input = document.getElementById('home-terminal-input');
                        if (input) {
                            input.focus();
                            input.click();
                        }
                    }
                }, { passive: true });
            }
        }
        
        if (legacySection) {
            const legacyTerminalWindow = legacySection.querySelector('.terminal-window');
            if (legacyTerminalWindow) {
                legacyTerminalWindow.addEventListener('touchend', function(e) {
                    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && 
                        !e.target.closest('a') && !e.target.closest('#legacy-input-line')) {
                        const input = document.getElementById('legacy-terminal-input');
                        if (input) {
                            input.focus();
                            input.click();
                        }
                    }
                }, { passive: true });
            }
        }
    }
    
    // Setup terminal window focus handlers
    setupTerminalWindowFocus();

    // Focus input when page becomes visible (mobile browser optimization)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            const homeSection = document.getElementById('home');
            const legacySection = document.getElementById('legacy');
            
            if (homeSection && homeSection.classList.contains('active')) {
                setTimeout(() => focusTerminalInput(), 200);
            } else if (legacySection && legacySection.classList.contains('active')) {
                setTimeout(() => focusLegacyTerminalInput(), 200);
            }
        }
    });

    // Legacy section terminal input handler
    const legacyTerminalInput = document.getElementById('legacy-terminal-input');
    const legacyCommandHistory = document.getElementById('legacy-command-history');
    const legacyMessage = document.getElementById('legacy-message');
    const legacyLinkContainer = document.getElementById('legacy-link-container');
    const correctAnswer = 'firestone';

    // Function to focus legacy terminal input (optimized for mobile)
    function focusLegacyTerminalInput() {
        if (legacyTerminalInput) {
            // Use requestAnimationFrame for better mobile performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    legacyTerminalInput.focus();
                    // On mobile, also trigger click to ensure keyboard opens
                    if (window.innerWidth <= 768) {
                        legacyTerminalInput.click();
                        // Ensure input is visible and scroll into view on mobile
                        legacyTerminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 200);
            });
        }
    }

    if (legacyTerminalInput) {
        // Focus input when legacy section is shown
        const legacySection = document.getElementById('legacy');
        if (legacySection) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (legacySection.classList.contains('active')) {
                            focusLegacyTerminalInput();
                        }
                    }
                });
            });
            observer.observe(legacySection, { attributes: true });
        }

        // Focus on initial load if legacy is active
        if (legacySection && legacySection.classList.contains('active')) {
            focusLegacyTerminalInput();
        }

        // Handle Enter key press
        legacyTerminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const userAnswer = this.value.trim().toLowerCase();
                
                if (userAnswer) {
                    // Display the answer (masked for security)
                    const commandLine = document.createElement('div');
                    commandLine.className = 'terminal-line';
                    commandLine.innerHTML = `<span class="prompt">agent$</span><span class="command">***</span>`;
                    legacyCommandHistory.appendChild(commandLine);
                    
                    // Clear input
                    this.value = '';
                    
                    // Check answer
                    if (userAnswer === correctAnswer) {
                        if (legacyMessage) {
                            legacyMessage.innerHTML = '<p class="success-message">> Correct! Access granted.</p>';
                            legacyMessage.style.color = 'var(--btn-maximize)';
                        }
                        if (legacyLinkContainer) {
                            legacyLinkContainer.style.display = 'block';
                        }
                    } else {
                        if (legacyMessage) {
                            legacyMessage.innerHTML = '<p class="error-message">> Incorrect answer. Access denied.</p>';
                            legacyMessage.style.color = 'var(--btn-close)';
                        }
                        if (legacyLinkContainer) {
                            legacyLinkContainer.style.display = 'none';
                        }
                    }
                }
            }
        });
    }

    // Home terminal interactive command handler
    const homeTerminalInput = document.getElementById('home-terminal-input');
    const homeCommandHistory = document.getElementById('home-command-history');
    const homeOutput = document.querySelector('#home .output');
    
    // Store content from each section for display BEFORE any dynamic content is added
    const sectionContents = {
        'ethnoguesser': document.querySelector('#ethnoguesser .output').innerHTML,
        'mymini': document.querySelector('#mymini .output').innerHTML,
        'geogame': document.querySelector('#geogame .output').innerHTML,
        'legacy': document.querySelector('#legacy .output').innerHTML
    };

    // MyMini embed functionality (run AFTER storing section contents)
    const myminiEmbedContainer = document.getElementById('mymini-embed-container');
    if (myminiEmbedContainer && MYMINI_URL) {
        // Create iframe to embed MyMini site
        const iframe = document.createElement('iframe');
        iframe.src = MYMINI_URL;
        iframe.title = 'MyMini Projects';
        iframe.className = 'mymini-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '4px';
        iframe.style.backgroundColor = 'var(--bg-primary)';
        
        myminiEmbedContainer.appendChild(iframe);
        
        // Add loading message
        const loadingMsg = document.createElement('p');
        loadingMsg.textContent = '> Loading MyMini...';
        loadingMsg.style.color = 'var(--text-secondary)';
        loadingMsg.style.marginBottom = '0.5rem';
        myminiEmbedContainer.insertBefore(loadingMsg, iframe);
        
        // Remove loading message when iframe loads
        iframe.onload = function() {
            loadingMsg.style.display = 'none';
        };
    } else if (myminiEmbedContainer && !MYMINI_URL) {
        // Show message if MyMini URL is not configured
        const noUrlMsg = document.createElement('p');
        noUrlMsg.innerHTML = '> <span style="color: var(--text-secondary);">To embed MyMini, add the deployed URL to MYMINI_URL in modern-script.js</span>';
        noUrlMsg.style.marginTop = '1rem';
        myminiEmbedContainer.appendChild(noUrlMsg);
    }

    if (homeTerminalInput) {
        // Track if we're waiting for legacy password
        let waitingForLegacyPassword = false;
        let legacyMessageDiv = null;
        let legacyLinkContainer = null;
        
        homeTerminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                
                if (command) {
                    // If waiting for legacy password, check the answer
                    if (waitingForLegacyPassword) {
                        const userAnswer = command.toLowerCase();
                        const correctAnswer = 'firestone';
                        
                        // Display the answer (masked for security)
                        const commandLine = document.createElement('div');
                        commandLine.className = 'terminal-line';
                        commandLine.innerHTML = `<span class="prompt">agent$</span><span class="command">***</span>`;
                        homeCommandHistory.appendChild(commandLine);
                        
                        // Clear input
                        this.value = '';
                        
                        // Check answer
                        if (userAnswer === correctAnswer) {
                            if (legacyMessageDiv) {
                                legacyMessageDiv.innerHTML = '<p class="success-message">> Correct! Access granted.</p>';
                                legacyMessageDiv.style.color = 'var(--btn-maximize)';
                            }
                            if (legacyLinkContainer) {
                                legacyLinkContainer.style.display = 'block';
                            }
                            waitingForLegacyPassword = false;
                        } else {
                            if (legacyMessageDiv) {
                                legacyMessageDiv.innerHTML = '<p class="error-message">> Incorrect answer. Access denied.</p>';
                                legacyMessageDiv.style.color = 'var(--btn-close)';
                            }
                            if (legacyLinkContainer) {
                                legacyLinkContainer.style.display = 'none';
                            }
                            // Keep waiting for correct answer
                        }
                        
                        return;
                    }
                    
                    const commandLower = command.toLowerCase();
                    
                    // Handle princess/sreeya command - redirect to princess page
                    if (commandLower === 'princess' || commandLower === 'sreeya') {
                        // Display the command
                        const commandLine = document.createElement('div');
                        commandLine.className = 'terminal-line';
                        commandLine.innerHTML = `<span class="prompt">agent$</span><span class="command">${command}</span>`;
                        homeCommandHistory.appendChild(commandLine);
                        
                        // Clear input
                        this.value = '';
                        
                        // Show loading message
                        const loadingDiv = document.createElement('div');
                        loadingDiv.className = 'output';
                        loadingDiv.innerHTML = `<p>> Opening letter...</p>`;
                        homeCommandHistory.appendChild(loadingDiv);
                        
                        // Redirect to princess page
                        setTimeout(() => {
                            window.location.href = 'princess.html';
                        }, 500);
                        
                        return;
                    }
                    
                    // Handle clear command separately
                    if (commandLower === 'clear') {
                        // Display the command
                        const commandLine = document.createElement('div');
                        commandLine.className = 'terminal-line';
                        commandLine.innerHTML = `<span class="prompt">agent$</span><span class="command">${command}</span>`;
                        homeCommandHistory.appendChild(commandLine);
                        
                        // Clear input
                        this.value = '';
                        
                        // Reset legacy password state
                        waitingForLegacyPassword = false;
                        legacyMessageDiv = null;
                        legacyLinkContainer = null;
                        
                        // Clear all command history and hide initial output
                        setTimeout(() => {
                            homeCommandHistory.innerHTML = '';
                            if (homeOutput) {
                                homeOutput.style.display = 'none';
                            }
                        }, 50);
                        
                        return;
                    }
                    
                    // Display the command in history
                    const commandLine = document.createElement('div');
                    commandLine.className = 'terminal-line';
                    commandLine.innerHTML = `<span class="prompt">agent$</span><span class="command">${command}</span>`;
                    homeCommandHistory.appendChild(commandLine);
                    
                    // Clear input
                    this.value = '';
                    
                    // Show output if it was hidden
                    if (homeOutput && homeOutput.style.display === 'none') {
                        homeOutput.style.display = 'block';
                    }
                    
                    // Handle the command
                    if (sectionContents[commandLower]) {
                        // Show loading message
                        const loadingDiv = document.createElement('div');
                        loadingDiv.className = 'output';
                        loadingDiv.innerHTML = `<p>> Loading ${commandLower}...</p>`;
                        homeCommandHistory.appendChild(loadingDiv);
                        
                        // After a brief delay, show the content (simulating loading)
                        setTimeout(() => {
                            loadingDiv.remove();
                            const contentDiv = document.createElement('div');
                            contentDiv.className = 'output';
                            contentDiv.innerHTML = sectionContents[commandLower];
                            homeCommandHistory.appendChild(contentDiv);
                            
                            // Re-initialize any special functionality (like MyMini embed, legacy password)
                            if (commandLower === 'mymini' && MYMINI_URL) {
                                const myminiContainer = contentDiv.querySelector('#mymini-embed-container');
                                if (myminiContainer) {
                                    // Clear any existing iframes in the container
                                    const existingIframes = myminiContainer.querySelectorAll('iframe');
                                    existingIframes.forEach(iframe => iframe.remove());
                                    
                                    // Remove any loading messages
                                    const loadingMsgs = myminiContainer.querySelectorAll('p');
                                    loadingMsgs.forEach(msg => msg.remove());
                                    
                                    // Create a single iframe
                                    const iframe = document.createElement('iframe');
                                    iframe.src = MYMINI_URL;
                                    iframe.title = 'MyMini Projects';
                                    iframe.style.width = '100%';
                                    iframe.style.height = '600px';
                                    iframe.style.border = 'none';
                                    iframe.style.borderRadius = '4px';
                                    iframe.style.backgroundColor = 'var(--bg-primary)';
                                    myminiContainer.appendChild(iframe);
                                }
                            }
                            
                            if (commandLower === 'legacy') {
                                // Set up legacy password mode
                                waitingForLegacyPassword = true;
                                legacyMessageDiv = contentDiv.querySelector('#legacy-message');
                                legacyLinkContainer = contentDiv.querySelector('#legacy-link-container');
                            }
                            
                            // Scroll to bottom
                            homeCommandHistory.scrollTop = homeCommandHistory.scrollHeight;
                        }, 300);
                    } else {
                        // Unknown command
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'output';
                        errorDiv.innerHTML = `<p style="color: var(--btn-close);">> Command not found: ${command}</p><p>> Available commands: ethnoguesser, mymini, geogame, legacy</p>`;
                        homeCommandHistory.appendChild(errorDiv);
                    }
                    
                    // Scroll to show new content
                    setTimeout(() => {
                        homeCommandHistory.scrollTop = homeCommandHistory.scrollHeight;
                    }, 50);
                }
            }
        });
    }
    
});

