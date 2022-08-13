<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Foundation\AbstractValidator;

class ListValidator extends AbstractValidator
{
    protected $rules = [
        'name' => 'required|string|max:255',
        'ordering' => 'required|in:manual,created:asc,created:desc,added:asc,added:desc',
    ];
}
