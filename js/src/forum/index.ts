import app from 'flarum/forum/app';
import DiscussionList from './models/DiscussionList';
import IndexPage from 'flarum/forum/components/IndexPage';
import addDiscussionControl from './addDiscussionControl';
import addIndexPage from './addIndexPage';
import addProfilePage from './addProfilePage';
import addSeries from './addSeries';

app.initializers.add('clarkwinkelmann-discussion-lists', () => {
    app.store.models['discussion-lists'] = DiscussionList;

    app.routes.discussionList = { path: '/discussion-lists/:list', component: IndexPage };

    addDiscussionControl();
    addIndexPage();
    addProfilePage();
    addSeries();
});
