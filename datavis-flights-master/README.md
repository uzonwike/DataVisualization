# Flight Data Viewer
We've spent the last two days putting together an interactive flight data viewer, but it's still missing some useful features. Your task for today is to add filters to the visualization: one to filter flight data by carrier, and another to filter by day of the week. We will go over the code briefly at the beginning of class, but most of it should be familiar from our in-class work.

The provided HTML file includes two form inputs for filtering: a dropdown list (using the `<select>` tag) and a series of checkboxes for the days of the week (using the `<input>` tag). There are also sample event handlers in flightdata.js on lines 37 and 43, which show how you can respond to input changes and access the current value of both types of filtering inputs.

You will need to load at least one additional data file to convert carrier codes into full airline names. You can find this information in data/carriers.csv. Weekdays are also encoded. The `DAY_OF_WEEK` field on each flight is a number, and the file data/weekdays.csv tells you how to convert from this number to a human-readable format. You can load this data file to do the conversion, or simply transcribe the short table into your code instead of loading yet another file.

The following references may be helpful as you implement your filtering behavior:

- [Crossfilter API Documentation](https://github.com/crossfilter/crossfilter/wiki/API-Reference)
- [D3 API](https://github.com/d3/d3/blob/master/API.md)
- [W3Schools.com HTML Forms](https://www.w3schools.com/html/html_forms.asp)

## Hints
1. *Do not manually add carrier options to your HTML file!* You should generate the options in the carrier dropdown menu using a D3 data join.
2. I strongly recommend that you do not show all carriers in the dataset in the dropdown. Instead, you could show just the top 25 carriers by total number of flights.
3. Don't forget to call `updateView()` after changing your filter information.

## Sources
This work draws on a number of D3 examples and the D3 documention. The D3 path animation is taken directly from <http://bl.ocks.org/duopixel/4063326>. Flight data are from the US Department of Transportation [RITA dataset](https://www.transtats.bts.gov/Fields.asp?Table_ID=236).