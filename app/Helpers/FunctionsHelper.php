<?php

namespace App\Helpers;

use DateTime;

class FunctionsHelper
{
    public static function diffMonths($d1, $d2)
    {
        $month_difference = 0;
        $date1 = new DateTime($d1);
        $date2 = new DateTime($d2);

        $interval = $date1->diff($date2);
        $years  = $interval->y;
        $months = $interval->m;
        $days   = $interval->d;

        // Calculate the total months difference with decimal
        $month_difference = $years * 12 + $months + $days / 30; // Assuming 30 days per month

        return number_format($month_difference, 1);
    }
}
