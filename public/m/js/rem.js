window.addEventListener('resize', getHtmlFontsize);
            // 设计稿750
            function getHtmlFontsize() {
                var designWeight = 750;
                var designFontsize = 200;
                var currentWweight = document.documentElement.clientWidth;
                var currentFontsize = currentWweight * designFontsize / designWeight;

                document.documentElement.style.fontSize = currentFontsize + 'px';
            }
            getHtmlFontsize();