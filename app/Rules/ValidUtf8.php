<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidUtf8 implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (preg_match("/[^A-Za-z0-9\-ÁÉÍÓÚáéíóúÑñ]/", $value) == false) {
            $fail("Debe ser una cadena de texto sin caracteres especiales. Por favor corrija el campo: ".$attribute);
        }
    }
}
