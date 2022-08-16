import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-discussion-lists', () => {
    app.extensionData
        .for('clarkwinkelmann-discussion-lists')
        .registerSetting({
            type: 'switch',
            setting: 'discussion-lists.collapseSeries',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.settings.collapseSeries'),
        })
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.viewPublic'),
            permission: 'discussion-lists.viewPublic',
            allowGuest: true,
        }, 'view')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.createPrivate'),
            permission: 'discussion-lists.createPrivate',
            allowGuest: true,
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.createPublic'),
            permission: 'discussion-lists.createPublic',
            allowGuest: true,
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.createSeriesFromOwn'),
            permission: 'discussion-lists.createSeriesFromOwn',
            allowGuest: true,
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.createSeriesFromAny'),
            permission: 'discussion-lists.createSeriesFromAny',
            allowGuest: true,
        }, 'reply')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.moderate'),
            permission: 'discussion-lists.moderate',
        }, 'moderate')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.admin.permissions.viewPrivate'),
            permission: 'discussion-lists.viewPrivate',
        }, 'moderate');
});
