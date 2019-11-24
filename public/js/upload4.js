window.onmousedown = function (e) {
    e.preventDefault();

    var el = e.target;

    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {

        e.stopPropagation();
        // toggle selection
        if (el.hasAttribute('selected'))
            el.removeAttribute('selected');

        else
            el.setAttribute('selected','');

        // hack to correct buggy behavior
        // var select = el.parentNode.cloneNode(true);
        // el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}