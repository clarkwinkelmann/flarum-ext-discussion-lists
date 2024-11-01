import DiscussionList from './src/forum/models/DiscussionList';

declare module 'flarum/forum/components/IndexPage' {
    export default interface IndexPage {
        currentActiveList?: DiscussionList
        currentListLoading?: boolean

        currentList(): DiscussionList | null
    }
}
