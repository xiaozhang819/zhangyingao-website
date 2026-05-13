/* ============================================
   个人成长之路 - 主JavaScript文件
   Personal Growth Journey - Main Script
   ============================================ */

'use strict';

// ==================== DOM Ready ====================
document.addEventListener('DOMContentLoaded', function() {

    // ---------- 加载屏幕 ----------
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 600);
    }

    // ---------- 导航栏滚动效果 ----------
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // 添加/移除 scrolled 类
        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 导航隐藏/显示
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;

        // 返回顶部按钮
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (currentScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // 滚动激活导航链接
        updateActiveNavLink();
    });

    // ---------- 移动端导航切换 ----------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击链接后关闭菜单
        document.querySelectorAll('.nav-menu a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ---------- 系统时间显示 ----------
    function updateClock() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekDay = weekDays[now.getDay()];

        const dateStr = year + '年' + month + '月' + day + '日 ' + weekDay;
        const timeStr = hours + ':' + minutes + ':' + seconds;

        const clockEls = document.querySelectorAll('.header-time');
        clockEls.forEach(function(el) {
            el.innerHTML = '<i class="fas fa-calendar-alt"></i> ' + dateStr + ' &nbsp;|&nbsp; <i class="fas fa-clock"></i> ' + timeStr;
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ---------- 轮播图 ----------
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicators span');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentSlide = 0;
        let autoPlayTimer = null;
        const INTERVAL = 4000;

        function goToSlide(index) {
            slides.forEach(function(slide) {
                slide.classList.remove('active');
            });
            indicators.forEach(function(ind) {
                ind.classList.remove('active');
            });

            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, INTERVAL);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        // 事件绑定
        if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); startAutoPlay(); });
        if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); startAutoPlay(); });

        indicators.forEach(function(ind) {
            ind.addEventListener('click', function() {
                var idx = parseInt(this.getAttribute('data-index'));
                goToSlide(idx);
                startAutoPlay();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // 触摸滑动
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, {passive: true});

        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoPlay();
        }, {passive: true});

        // 键盘控制
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
            if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
        });

        // 点击整张幻灯片跳转
        slides.forEach(function(slide) {
            slide.addEventListener('click', function() {
                var url = this.getAttribute('data-url');
                if (url) window.location.href = url;
            });
        });

        // 初始显示第一张幻灯片，再启动自动播放
        goToSlide(0);
        startAutoPlay();
    }

    // ---------- 滚动显示动画 ----------
    function isInViewport(el, offset) {
        if (offset === undefined) offset = 100;
        var rect = el.getBoundingClientRect();
        return rect.top <= window.innerHeight - offset && rect.bottom >= 0;
    }

    function handleReveal() {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function(el) {
            if (isInViewport(el, 80) && !el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', handleReveal);
    window.addEventListener('load', function() {
        setTimeout(handleReveal, 500);
    });
    handleReveal();

    // ---------- 数字计数动画 ----------
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = parseInt(el.getAttribute('data-duration')) || 2000;
        var startTime = null;

        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var counter = entry.target;
                if (!counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-number').forEach(function(el) {
        counterObserver.observe(el);
    });

    // ---------- 技能条动画 ----------
    var skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var fill = entry.target;
                var targetWidth = fill.getAttribute('data-width') || '0%';
                fill.style.width = '0%';
                setTimeout(function() {
                    fill.style.width = targetWidth;
                }, 200);
                skillObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(function(el) {
        skillObserver.observe(el);
    });

    // 课程进度条动画
    var progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var fill = entry.target;
                var targetWidth = fill.getAttribute('data-width') || '0%';
                fill.style.width = targetWidth;
                progressObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-fill').forEach(function(el) {
        progressObserver.observe(el);
    });

    // ---------- 返回顶部 ----------
    var backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ---------- 画廊筛选 ----------
    var filterButtons = document.querySelectorAll('.gallery-filters button');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var filter = this.getAttribute('data-filter');

                filterButtons.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                galleryItems.forEach(function(item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'scaleIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ---------- 平滑滚动到锚点 ----------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- 联系表单处理 ----------
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                showFormMessage('请填写所有必填字段', 'error');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                e.preventDefault();
                showFormMessage('请输入有效的电子邮箱地址', 'error');
                return;
            }
        });

        function showFormMessage(text, type) {
            var existing = document.querySelector('.form-message');
            if (existing) existing.remove();

            var msg = document.createElement('div');
            msg.className = 'form-message notify ' + type;
            msg.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i><p>' + text + '</p>';
            contactForm.insertBefore(msg, contactForm.firstChild);

            setTimeout(function() { msg.remove(); }, 4000);
        }

        if (window.location.search.indexOf('success=true') !== -1) {
            showFormMessage('消息发送成功！感谢您的留言。', 'success');
        }
    }

    // ---------- 更新激活的导航链接 ----------
    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-menu a');

        var current = '';
        sections.forEach(function(section) {
            var top = section.offsetTop - 150;
            var bottom = top + section.offsetHeight;
            if (window.pageYOffset >= top && window.pageYOffset < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // ---------- 背景粒子效果 ----------
    function initParticles() {
        var canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouseX = 0;
        var mouseY = 0;
        var PARTICLE_COUNT = 80;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticles() {
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: Math.random() * 2.5 + 1,
                    alpha: Math.random() * 0.4 + 0.1,
                    color: getRandomColor()
                });
            }
        }

        function getRandomColor() {
            var colors = ['#00d4ff', '#7b2ff7', '#ff6b6b', '#00e676', '#ffd740'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(function(p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();

                // 更新位置
                p.x += p.vx;
                p.y += p.vy;

                // 边界处理
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // 鼠标交互
                var dx = mouseX - p.x;
                var dy = mouseY - p.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    p.x -= dx * 0.005;
                    p.y -= dy * 0.005;
                }
            });

            // 绘制连线
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = particles[i].color;
                        ctx.globalAlpha = (1 - dist / 150) * 0.15;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        resize();
        createParticles();
        draw();
    }

    initParticles();

    // ---------- 猜数游戏相关（如果存在） ----------
    initGame();

    // ---------- 课程卡片3D倾斜效果 ----------
    document.querySelectorAll('.feature-card, .course-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / centerY * -8;
            var rotateY = (x - centerX) / centerX * 8;
            this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ---------- 打字机效果 ----------
    function initTypewriter() {
        var container = document.querySelector('.typewriter-container');
        if (!container) return;

        var texts = [
            '张迎奥 <span class="highlight">同学</span>，黄河交通学院人工智能学院',
            '国家级 <span class="highlight">5项</span>，省级 <span class="highlight">7项</span>，院校级 <span class="highlight">15项</span>荣誉',
            '预备党员 <span class="highlight">·</span> 班长 <span class="highlight">·</span> 兼职团委副书记',
            '<span class="highlight">国家励志奖学金</span> 2024 · 2025 年度'
        ];
        var textIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var cursor = container.querySelector('.typewriter-cursor');
        var textSpan = container.querySelector('.typewriter-text');

        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'typewriter-text';
            if (cursor) {
                container.insertBefore(textSpan, cursor);
            } else {
                container.appendChild(textSpan);
            }
        }

        function type() {
            var currentText = texts[textIndex];

            if (!isDeleting) {
                textSpan.innerHTML = currentText.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
                setTimeout(type, 60 + Math.random() * 60);
            } else {
                textSpan.innerHTML = currentText.substring(0, charIndex);
                charIndex--;
                if (charIndex < 0) {
                    isDeleting = false;
                    charIndex = 0;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                    return;
                }
                setTimeout(type, 30 + Math.random() * 30);
            }
        }

        setTimeout(type, 1500);
    }

    initTypewriter();

    // ---------- 视差滚动 ----------
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        }
    });

    // ---------- 404页面倒计时 ----------
    var countdownEl = document.querySelector('.countdown-number');
    if (countdownEl) {
        var count = 10;
        var countdownTimer = setInterval(function() {
            count--;
            countdownEl.textContent = count;
            if (count <= 0) {
                clearInterval(countdownTimer);
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    console.log('%c 成长之路 🚀 ', 'background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: #fff; font-size: 24px; font-weight: bold; padding: 15px 30px; border-radius: 10px;');
    console.log('%c 用代码构建未来，以创新引领成长 ', 'color: #00d4ff; font-size: 14px; font-style: italic;');

});

// ==================== 猜数游戏 ====================
function initGame() {
    var gameCard = document.querySelector('.game-card');
    if (!gameCard) return;

    var guessInput = document.getElementById('guessInput');
    var guessBtn = document.getElementById('guessBtn');
    var resetBtn = document.getElementById('resetBtn');
    var messageEl = document.getElementById('gameMessage');
    var attemptsEl = document.getElementById('attempts');
    var historyList = document.getElementById('historyList');
    var chancesEl = document.getElementById('chances');

    // 游戏状态
    var secretNumber = Math.floor(Math.random() * 100) + 1;
    var attempts = 0;
    var maxAttempts = 10;
    var isGameOver = false;
    var guesses = [];

    if (chancesEl) chancesEl.textContent = maxAttempts;

    function checkGuess() {
        if (isGameOver) {
            setMessage('游戏已结束，请点击"重新开始"', 'hint-lose');
            return;
        }

        var guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            setMessage('请输入1-100之间的有效数字！', 'hint-high');
            guessInput.value = '';
            guessInput.focus();
            return;
        }

        if (guesses.indexOf(guess) !== -1) {
            setMessage('你已经猜过这个数字了，请换一个！', 'hint-high');
            guessInput.value = '';
            guessInput.focus();
            return;
        }

        attempts++;
        guesses.push(guess);
        if (attemptsEl) attemptsEl.textContent = attempts;

        var remaining = maxAttempts - attempts;
        if (chancesEl) chancesEl.textContent = remaining;

        // 添加到历史
        addHistory(guess);

        if (guess === secretNumber) {
            setMessage('🎉 恭喜你猜对了！答案就是 ' + secretNumber + '！你用了 ' + attempts + ' 次猜中！', 'hint-win');
            isGameOver = true;
            if (guessBtn) guessBtn.disabled = true;
            createCelebration();
        } else if (attempts >= maxAttempts) {
            setMessage('😅 很遗憾，次数用完了！正确答案是 ' + secretNumber, 'hint-lose');
            isGameOver = true;
            if (guessBtn) guessBtn.disabled = true;
        } else if (guess > secretNumber) {
            setMessage('📈 太大了！再试试（还剩 ' + remaining + ' 次机会）', 'hint-high');
        } else {
            setMessage('📉 太小了！再试试（还剩 ' + remaining + ' 次机会）', 'hint-low');
        }

        guessInput.value = '';
        guessInput.focus();
    }

    function setMessage(text, className) {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.className = 'game-message ' + className;
        // 添加震动动画
        messageEl.style.animation = 'none';
        setTimeout(function() {
            messageEl.style.animation = 'shake 0.4s ease';
        }, 10);
    }

    function addHistory(guess) {
        if (!historyList) return;
        var item = document.createElement('span');
        item.className = 'history-item';
        if (guess === secretNumber) {
            item.classList.add('correct');
            item.textContent = '✓ ' + guess;
        } else if (guess > secretNumber) {
            item.classList.add('high');
            item.textContent = '↓ ' + guess;
        } else {
            item.classList.add('low');
            item.textContent = '↑ ' + guess;
        }
        historyList.appendChild(item);
    }

    function resetGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        guesses = [];
        isGameOver = false;

        if (attemptsEl) attemptsEl.textContent = '0';
        if (chancesEl) chancesEl.textContent = maxAttempts;
        if (guessBtn) guessBtn.disabled = false;
        if (messageEl) {
            messageEl.textContent = '新游戏已开始！猜一个1-100之间的数字';
            messageEl.className = 'game-message';
        }
        if (historyList) historyList.innerHTML = '';
        if (guessInput) {
            guessInput.value = '';
            guessInput.focus();
        }

        // 移除庆祝动画
        var celebration = document.querySelector('.celebration');
        if (celebration) celebration.remove();
    }

    // 创建庆祝动画
    function createCelebration() {
        var celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);

        var colors = ['#00d4ff', '#7b2ff7', '#ff6b6b', '#00e676', '#ffd740', '#fff'];
        for (var i = 0; i < 80; i++) {
            var confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 8 + 4) + 'px';
            confetti.style.height = (Math.random() * 8 + 4) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 1.5) + 's';
            celebration.appendChild(confetti);
        }

        setTimeout(function() {
            celebration.remove();
        }, 5000);
    }

    // 事件绑定
    if (guessBtn) guessBtn.addEventListener('click', checkGuess);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    if (guessInput) {
        guessInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') checkGuess();
        });
    }

    // 初始消息
    if (messageEl) {
        messageEl.textContent = '猜一个1-100之间的数字，你有 ' + maxAttempts + ' 次机会！';
    }

    // 添加shake动画
    var style = document.createElement('style');
    style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }';
    document.head.appendChild(style);
}

// ---------- 添加淡入动画的CSS ----------
(function() {
    var style = document.createElement('style');
    style.textContent = '.gallery-item { animation: scaleIn 0.5s ease both; }';
    style.textContent += '.gallery-item:nth-child(1) { animation-delay: 0.05s; }';
    style.textContent += '.gallery-item:nth-child(2) { animation-delay: 0.1s; }';
    style.textContent += '.gallery-item:nth-child(3) { animation-delay: 0.15s; }';
    style.textContent += '.gallery-item:nth-child(4) { animation-delay: 0.2s; }';
    style.textContent += '.gallery-item:nth-child(5) { animation-delay: 0.25s; }';
    style.textContent += '.gallery-item:nth-child(6) { animation-delay: 0.3s; }';
    document.head.appendChild(style);
})();
