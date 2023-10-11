<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class MaxWords implements ValidationRule
{
    private $max_words;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($max_words)
    {
        $this->max_words = $max_words;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $words      = explode(' ', $value);
        $nb_words   = count($words);

        if (($nb_words >= 0 && $nb_words <= $this->max_words) == false) {
            $fail("El {$attribute} debe tener máximo {$this->max_words} palabras.");
        }
    }
}
