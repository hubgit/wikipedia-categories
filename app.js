$(document).on('click', 'h2 > a', function(event) {
    event.preventDefault();

    var link = $(event.target);
    var category = link.attr('href').slice(1);

    var heading = link.parent();
    var container = heading.next('.category');

    if (container.length) {
        if (container.is(':visible')) {
            container.hide();
        } else {
            container.show();
        }

        return;
    }

    if (!container.length) {
       container = $('<div/>').addClass('category').insertAfter(link.parent());
    }

    var subcatRequest = $.getJSON('https://en.wikipedia.org/w/api.php?callback=?', {
        'action': 'query',
        'list': 'categorymembers',
        'cmtype': 'subcat',
        'cmlimit': 'max',
        'format': 'json',
        'cmtitle': category,
    });

    var pageRequest = $.getJSON('https://en.wikipedia.org/w/api.php?callback=?', {
        'action': 'query',
        'list': 'categorymembers',
        'cmtype': 'page',
        'cmlimit': 'max',
        'format': 'json',
        'cmtitle': category,
    });

    subcatRequest.done(function(data) {
        $.each(data.query.categorymembers, function(index, member) {
            var item = $('<h2/>');

            var link = $('<a/>', {
                href: '#' + member.title.replace(/\s/g, '_'),
                text: member.title.replace(/^Category:/, ''),
            });

            item.append(link).appendTo(container);
        });

        pageRequest.done(function(data) {
            $.each(data.query.categorymembers, function(index, member) {
                var item = $('<div/>');

                var link = $('<a/>', {
                    href: 'https://en.wikipedia.org/wiki/' + member.title.replace(/\s/g, '_'),
                    text: member.title,
                    target: '_blank',
                });

                item.append(link).appendTo(container);
            });
        });
    });
});

$('h2 a').click();
