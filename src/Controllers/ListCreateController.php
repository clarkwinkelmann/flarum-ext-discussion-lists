<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use ClarkWinkelmann\DiscussionLists\ListSerializer;
use ClarkWinkelmann\DiscussionLists\ListValidator;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListCreateController extends AbstractCreateController
{
    public $serializer = ListSerializer::class;

    protected $validator;

    public function __construct(ListValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document): DiscussionList
    {
        $actor = RequestUtil::getActor($request);
        $attributes = Arr::get($request->getParsedBody(), 'data.attributes') ?: [];

        $this->validator->assertValid($attributes);

        $list = new DiscussionList();

        switch (Arr::get($attributes, 'visibility')) {
            case 'series':
                $actor->assertCan('createSeries', DiscussionList::class);
                $list->visibility = 'series';
                break;
            case 'public':
                $actor->assertCan('createPublic', DiscussionList::class);
                $list->visibility = 'public';
                break;
            default:
                $actor->assertCan('createPrivate', DiscussionList::class);
                $list->visibility = 'private';
                break;
        }

        $list->name = Arr::get($attributes, 'name');
        $list->ordering = Arr::get($attributes, 'ordering') ?: 'manual';
        $list->user()->associate($actor);
        $list->save();

        return $list;
    }
}
