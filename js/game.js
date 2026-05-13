/* ============================================
   猜数游戏 - 独立版本
   ============================================ */

(function() {
    'use strict';

    // 确保页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGameStandalone);
    } else {
        initGameStandalone();
    }

    function initGameStandalone() {
        var gameSection = document.querySelector('.game-section');
        if (!gameSection) return;

        // 完整的猜数游戏实现
        var GameState = {
            secret: Math.floor(Math.random() * 100) + 1,
            attempts: 0,
            maxAttempts: 10,
            isOver: false,
            guesses: [],
            hints: [],
            startTime: Date.now(),
            gamesWon: parseInt(localStorage.getItem('gamesWon') || '0'),
            gamesLost: parseInt(localStorage.getItem('gamesLost') || '0'),
            bestScore: parseInt(localStorage.getItem('bestScore') || '999')
        };

        var UI = {
            input: document.getElementById('guessInput'),
            guessBtn: document.getElementById('guessBtn'),
            resetBtn: document.getElementById('resetBtn'),
            hintBtn: document.getElementById('hintBtn'),
            message: document.getElementById('gameMessage'),
            attempts: document.getElementById('attempts'),
            chances: document.getElementById('chances'),
            history: document.getElementById('historyList'),
            wins: document.getElementById('gamesWon'),
            losses: document.getElementById('gamesLost'),
            bestScore: document.getElementById('bestScore'),
            rangeLow: document.getElementById('rangeLow'),
            rangeHigh: document.getElementById('rangeHigh'),
            timer: document.getElementById('gameTimer')
        };

        // 初始化UI显示
        if (UI.attempts) UI.attempts.textContent = '0';
        if (UI.chances) UI.chances.textContent = GameState.maxAttempts;
        if (UI.wins) UI.wins.textContent = GameState.gamesWon;
        if (UI.losses) UI.losses.textContent = GameState.gamesLost;
        if (UI.bestScore) UI.bestScore.textContent = GameState.bestScore === 999 ? '-' : GameState.bestScore;
        if (UI.rangeLow) UI.rangeLow.textContent = '1';
        if (UI.rangeHigh) UI.rangeHigh.textContent = '100';

        if (UI.message) {
            UI.message.textContent = '🎯 猜一个 1-100 之间的数字，你有 ' + GameState.maxAttempts + ' 次机会！';
            UI.message.className = 'game-message';
        }

        // 计时器
        var timerInterval = null;
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            GameState.startTime = Date.now();
            timerInterval = setInterval(function() {
                if (!UI.timer) return;
                var elapsed = Math.floor((Date.now() - GameState.startTime) / 1000);
                var minutes = Math.floor(elapsed / 60);
                var seconds = elapsed % 60;
                UI.timer.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
            }, 1000);
        }
        startTimer();

        // 检查猜测
        function checkGuess() {
            if (GameState.isOver) {
                setMessage('⛔ 游戏已结束，点击"重新开始"再来一局！', 'hint-lose');
                return;
            }

            var val = UI.input ? UI.input.value.trim() : '';
            var guess = parseInt(val);

            if (val === '' || isNaN(guess)) {
                setMessage('⚠️ 请输入一个有效的数字！', 'hint-high');
                shakeInput();
                return;
            }

            if (guess < 1 || guess > 100) {
                setMessage('⚠️ 数字必须在 1 到 100 之间！', 'hint-high');
                shakeInput();
                return;
            }

            if (GameState.guesses.indexOf(guess) !== -1) {
                setMessage('🔄 你已经猜过 ' + guess + ' 了，换一个数字吧！', 'hint-high');
                shakeInput();
                return;
            }

            // 有效猜测
            GameState.attempts++;
            GameState.guesses.push(guess);

            if (UI.attempts) UI.attempts.textContent = GameState.attempts;
            if (UI.chances) UI.chances.textContent = GameState.maxAttempts - GameState.attempts;

            addHistoryItem(guess);

            // 判断结果
            var remaining = GameState.maxAttempts - GameState.attempts;

            if (guess === GameState.secret) {
                // 赢了！
                setMessage('🎉🎉🎉 太棒了！答案就是 ' + GameState.secret + '！你用了 ' + GameState.attempts + ' 次猜中！', 'hint-win');
                GameState.isOver = true;
                if (UI.guessBtn) UI.guessBtn.disabled = true;

                GameState.gamesWon++;
                if (UI.wins) UI.wins.textContent = GameState.gamesWon;
                localStorage.setItem('gamesWon', GameState.gamesWon);

                if (GameState.attempts < GameState.bestScore) {
                    GameState.bestScore = GameState.attempts;
                    if (UI.bestScore) UI.bestScore.textContent = GameState.attempts;
                    localStorage.setItem('bestScore', GameState.attempts);
                    setMessage('🏆🏆🏆 新纪录！只用 ' + GameState.attempts + ' 次就猜中了！答案就是 ' + GameState.secret + '！', 'hint-win');
                }

                createCelebration();
                stopTimer();

            } else if (GameState.attempts >= GameState.maxAttempts) {
                // 输了
                setMessage('😅 机会用完了！正确答案是 ' + GameState.secret + '，下次加油！', 'hint-lose');
                GameState.isOver = true;
                if (UI.guessBtn) UI.guessBtn.disabled = true;

                GameState.gamesLost++;
                if (UI.losses) UI.losses.textContent = GameState.gamesLost;
                localStorage.setItem('gamesLost', GameState.gamesLost);
                stopTimer();

            } else if (guess > GameState.secret) {
                setMessage('📈 太大了！再试试（还剩 ' + remaining + ' 次机会）', 'hint-high');
            } else {
                setMessage('📉 太小了！再试试（还剩 ' + remaining + ' 次机会）', 'hint-low');
            }

            if (UI.input) {
                UI.input.value = '';
                UI.input.focus();
            }

            // 更新范围提示
            updateRange();
        }

        function setMessage(text, className) {
            if (!UI.message) return;
            UI.message.innerHTML = text;
            UI.message.className = 'game-message ' + (className || '');
        }

        function shakeInput() {
            if (!UI.input) return;
            UI.input.style.animation = 'none';
            setTimeout(function() {
                UI.input.style.animation = 'shake 0.4s ease';
            }, 10);
            UI.input.value = '';
            UI.input.focus();
        }

        function addHistoryItem(guess) {
            if (!UI.history) return;
            var item = document.createElement('span');
            item.className = 'history-item';

            if (guess === GameState.secret) {
                item.classList.add('correct');
                item.textContent = '🎯 ' + guess;
            } else if (guess > GameState.secret) {
                item.classList.add('high');
                item.textContent = '⬇ ' + guess;
            } else {
                item.classList.add('low');
                item.textContent = '⬆ ' + guess;
            }

            item.style.animation = 'scaleIn 0.3s ease';
            UI.history.appendChild(item);
            UI.history.scrollTop = UI.history.scrollHeight;
        }

        function updateRange() {
            if (!UI.rangeLow || !UI.rangeHigh) return;
            var low = 1, high = 100;
            GameState.guesses.forEach(function(g) {
                if (g < GameState.secret && g > low) low = g;
                if (g > GameState.secret && g < high) high = g;
            });
            UI.rangeLow.textContent = low;
            UI.rangeHigh.textContent = high;
        }

        function getHint() {
            if (GameState.isOver) {
                setMessage('游戏已结束，点击"重新开始"再来一局', 'hint-lose');
                return;
            }
            var hints = [];
            if (GameState.secret % 2 === 0) hints.push('偶数');
            else hints.push('奇数');

            if (GameState.secret > 50) hints.push('大于50');
            else hints.push('小于等于50');

            if (GameState.secret % 3 === 0) hints.push('是3的倍数');
            if (GameState.secret % 5 === 0) hints.push('是5的倍数');
            if (GameState.secret % 7 === 0) hints.push('是7的倍数');
            if (GameState.secret % 10 === 0) hints.push('是10的倍数');

            if (GameState.secret >= 10 && GameState.secret <= 19) hints.push('在10-19之间');
            else if (GameState.secret >= 20 && GameState.secret <= 29) hints.push('在20-29之间');
            else if (GameState.secret >= 30 && GameState.secret <= 39) hints.push('在30-39之间');
            else if (GameState.secret >= 40 && GameState.secret <= 49) hints.push('在40-49之间');
            else if (GameState.secret >= 60 && GameState.secret <= 69) hints.push('在60-69之间');
            else if (GameState.secret >= 70 && GameState.secret <= 79) hints.push('在70-79之间');
            else if (GameState.secret >= 80 && GameState.secret <= 89) hints.push('在80-89之间');
            else if (GameState.secret >= 90 && GameState.secret <= 99) hints.push('在90-99之间');

            var hint = hints[Math.floor(Math.random() * hints.length)];
            setMessage('💡 提示：这个数字是' + hint + '！', 'hint-high');
        }

        function resetGame() {
            GameState.secret = Math.floor(Math.random() * 100) + 1;
            GameState.attempts = 0;
            GameState.guesses = [];
            GameState.isOver = false;

            if (UI.attempts) UI.attempts.textContent = '0';
            if (UI.chances) UI.chances.textContent = GameState.maxAttempts;
            if (UI.guessBtn) UI.guessBtn.disabled = false;
            if (UI.rangeLow) UI.rangeLow.textContent = '1';
            if (UI.rangeHigh) UI.rangeHigh.textContent = '100';

            if (UI.message) {
                UI.message.textContent = '🔄 新游戏开始！猜一个 1-100 之间的数字';
                UI.message.className = 'game-message';
            }

            if (UI.history) UI.history.innerHTML = '';
            if (UI.input) {
                UI.input.value = '';
                UI.input.focus();
            }

            // 移除庆祝
            var celebration = document.querySelector('.celebration');
            if (celebration) celebration.remove();

            startTimer();
        }

        function createCelebration() {
            var existing = document.querySelector('.celebration');
            if (existing) existing.remove();

            var celebration = document.createElement('div');
            celebration.className = 'celebration';
            document.body.appendChild(celebration);

            var colors = ['#00d4ff', '#7b2ff7', '#ff6b6b', '#00e676', '#ffd740', '#ffffff', '#ff9100', '#e040fb'];
            var symbols = ['✦', '●', '■', '★', '♦', '❤', '◆', '▲'];

            for (var i = 0; i < 120; i++) {
                var el = document.createElement('div');
                el.className = 'confetti';
                el.style.left = Math.random() * 100 + '%';
                el.style.top = '-20px';
                el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                el.style.width = (Math.random() * 10 + 4) + 'px';
                el.style.height = (Math.random() * 10 + 4) + 'px';
                el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                el.style.animationDuration = (Math.random() * 3 + 2) + 's';
                el.style.animationDelay = (Math.random() * 2) + 's';
                el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                celebration.appendChild(el);
            }

            // 大文字庆祝
            var textEl = document.createElement('div');
            textEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:4rem;font-weight:900;background:linear-gradient(135deg,#00d4ff,#7b2ff7,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:scaleIn 0.5s ease;z-index:10000;text-align:center;pointer-events:none;';
            textEl.textContent = '🎉 恭喜通关 🎉';
            document.body.appendChild(textEl);

            setTimeout(function() {
                textEl.style.transition = 'all 0.5s ease';
                textEl.style.transform = 'translate(-50%,-50%) scale(1.5)';
                textEl.style.opacity = '0';
                setTimeout(function() { textEl.remove(); }, 500);
            }, 2000);

            setTimeout(function() {
                celebration.remove();
            }, 5000);
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        // 键盘支持
        if (UI.input) {
            UI.input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') checkGuess();
                if (e.key === 'Escape') {
                    UI.input.value = '';
                    UI.input.blur();
                }
            });
        }

        // 按钮事件
        if (UI.guessBtn) UI.guessBtn.addEventListener('click', checkGuess);
        if (UI.resetBtn) UI.resetBtn.addEventListener('click', resetGame);
        if (UI.hintBtn) UI.hintBtn.addEventListener('click', getHint);

        // 动态难度选择
        var difficultyBtns = document.querySelectorAll('.diff-btn');
        difficultyBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var diff = this.getAttribute('data-diff');
                difficultyBtns.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                switch(diff) {
                    case 'easy':
                        GameState.maxAttempts = 15;
                        break;
                    case 'normal':
                        GameState.maxAttempts = 10;
                        break;
                    case 'hard':
                        GameState.maxAttempts = 6;
                        break;
                    case 'expert':
                        GameState.maxAttempts = 3;
                        break;
                }

                if (UI.chances) UI.chances.textContent = GameState.maxAttempts;
                resetGame();
            });
        });

        // 暴露到全局供调试
        window.__gameState = GameState;
    }
})();
