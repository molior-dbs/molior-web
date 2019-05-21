export const SlideToggleDirective = () => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            var target, content;
            attrs.expanded = false;
            element.bind('click', () => {
                if (!target) {
                    target = document.querySelector(attrs.slideToggle);
                }
                if (!content) {
                    content = target.querySelector('.slideable_content');
                }

                if (!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.overflow = 'hidden';
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    };
};