import Model from 'flarum/common/Model';
import Discussion from 'flarum/common/models/Discussion';
import User from 'flarum/common/models/User';

export default class DiscussionList extends Model {
    name = Model.attribute<string>('name')
    isPublic = Model.attribute<boolean>('isPublic')
    ordering = Model.attribute<string>('ordering')
    discussionCount = Model.attribute<number>('discussionCount')
    canEdit = Model.attribute<boolean>('canEdit')

    user = Model.hasOne<User>('user')
    discussions = Model.hasMany<Discussion>('discussions')
}
