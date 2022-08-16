<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Foundation\AbstractValidator;

class ListValidator extends AbstractValidator
{
    protected $rules = [
        'name' => 'required|string|max:255',
        'visibility' => 'nullable|in:private,public,series',
        'ordering' => 'required|in:manual,created:asc,created:desc,added:asc,added:desc',
    ];
}
