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

        if (Arr::get($attributes, 'isPublic')) {
            $actor->assertCan('createPublic', DiscussionList::class);
            $list->is_public = true;
        } else {
            $actor->assertCan('createPrivate', DiscussionList::class);
            $list->is_public = false;
        }

        $list->name = Arr::get($attributes, 'name');
        $list->ordering = Arr::get($attributes, 'ordering') ?: 'manual';
        $list->user()->associate($actor);
        $list->save();

        return $list;
    }
}
