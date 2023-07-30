<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class MaxWords implements ValidationRule
{
    private $maxWords;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($maxWords)
    {
        $this->maxWords = $maxWords;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $words      = explode(' ', $value);
        $nbWords    = count($words);

        if (($nbWords >= 0 && $nbWords <= $this->maxWords) == false) {
            $fail("Este campo debe tener máximo {$this->maxWords} palabras.");
        }
    }
}
