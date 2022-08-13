import Model from 'flarum/common/Model';

declare module 'flarum/forum/components/IndexPage' {
    export default interface IndexPage {
        currentActiveList?: Model
        currentListLoading?: boolean

        currentList(): Model | null
    }
}
