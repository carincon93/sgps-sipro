<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MaxWords implements Rule
{
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
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $words      = explode(' ', $value);
        $nbWords    = count($words);

        return ($nbWords >= 0 && $nbWords <= $this->maxWords);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return "Este campo debe tener máximo {$this->maxWords} palabras.";
    }
}
