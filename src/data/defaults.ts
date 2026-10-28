// @ts-nocheck
// Auto-extracted from reverse-engineered RenderCV bundle (fZfvHZae.js)
const zr=["classic","ember","engineeringclassic","engineeringresumes","harvard","ink","moderncv","opal","sb2nov"],Vr=["english","arabic","danish","dutch","french","german","hebrew","hindi","hungarian","indonesian","italian","japanese","korean","mandarin_chinese","norwegian_bokmål","norwegian_nynorsk","persian","portuguese","russian","spanish","turkish","vietnamese"],gr={classic:`design:
  theme: classic
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 79, 144)
    headline: rgb(0, 79, 144)
    connections: rgb(0, 79, 144)
    section_titles: rgb(0, 79, 144)
    links: rgb(0, 79, 144)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: Source Sans 3
      name: Source Sans 3
      headline: Source Sans 3
      connections: Source Sans 3
      section_titles: Source Sans 3
    font_size:
      body: 10pt
      name: 30pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: true
      headline: false
      connections: false
      section_titles: true
  links:
    underline: false
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: true
      display_urls_instead_of_usernames: false
      separator: ''
      space_between_connections: 0.5cm
  section_titles:
    type: with_partial_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.2em
    space_between_text_based_entries: 0.3em
    show_time_spans_in:
      - experience
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.2cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: true
    degree_width: 1cm
    summary:
      space_above: 0cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0.15cm
      space_above: 0cm
      space_between_items: 0cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, AREA
        SUMMARY
        HIGHLIGHTS
      degree_column: '**DEGREE**'
      date_and_location_column: |-
        LOCATION
        DATE
    normal_entry:
      main_column: |-
        **NAME**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        LOCATION
        DATE
    experience_entry:
      main_column: |-
        **COMPANY**, POSITION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        LOCATION
        DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,ember:`design:
  theme: ember
  page:
    size: us-letter
    top_margin: 0.6in
    bottom_margin: 0.6in
    left_margin: 0.6in
    right_margin: 0.6in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(35, 31, 32)
    name: rgb(155, 35, 25)
    headline: rgb(90, 60, 55)
    connections: rgb(100, 75, 68)
    section_titles: rgb(155, 35, 25)
    links: rgb(155, 35, 25)
    footer: rgb(140, 125, 118)
    top_note: rgb(140, 125, 118)
  typography:
    line_spacing: 0.6em
    alignment: justified-with-no-hyphenation
    date_and_location_column_alignment: right
    font_family:
      body: Ubuntu
      name: Gentium Book Plus
      headline: Gentium Book Plus
      connections: Ubuntu
      section_titles: Ubuntu
    font_size:
      body: 10pt
      name: 30pt
      headline: 10.5pt
      connections: 9pt
      section_titles: 1.25em
    small_caps:
      name: false
      headline: true
      connections: false
      section_titles: true
    bold:
      name: true
      headline: false
      connections: false
      section_titles: false
  links:
    underline: true
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.5cm
    space_below_headline: 0.4cm
    space_below_connections: 0.6cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: false
      display_urls_instead_of_usernames: false
      separator: ·
      space_between_connections: 0.5cm
  section_titles:
    type: centered_without_line
    line_thickness: 0.5pt
    space_above: 0.55cm
    space_below: 0.25cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.1em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.1cm
    space_between_columns: 0.15cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0.05cm
      space_left: 0cm
    highlights:
      bullet: ◆
      nested_bullet: ◦
      space_left: 0.15cm
      space_above: 0.05cm
      space_between_items: 0.04cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION** -- LOCATION
        *DEGREE_WITH_AREA*
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **COMPANY** -- LOCATION
        *POSITION*
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,engineeringclassic:`design:
  theme: engineeringclassic
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 79, 144)
    headline: rgb(0, 79, 144)
    connections: rgb(0, 79, 144)
    section_titles: rgb(0, 79, 144)
    links: rgb(0, 79, 144)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: Raleway
      name: Raleway
      headline: Raleway
      connections: Raleway
      section_titles: Raleway
    font_size:
      body: 10pt
      name: 30pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: false
      headline: false
      connections: false
      section_titles: false
  links:
    underline: false
    show_external_link_icon: false
  header:
    alignment: left
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: true
      display_urls_instead_of_usernames: false
      separator: ''
      space_between_connections: 0.5cm
  section_titles:
    type: with_full_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.2em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.2cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0.12cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0cm
      space_above: 0.12cm
      space_between_items: 0.12cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, DEGREE_WITH_AREA -- LOCATION
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- **LOCATION**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **POSITION**, COMPANY -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,engineeringresumes:`design:
  theme: engineeringresumes
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: false
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 0, 0)
    headline: rgb(0, 0, 0)
    connections: rgb(0, 0, 0)
    section_titles: rgb(0, 0, 0)
    links: rgb(0, 0, 0)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: XCharter
      name: XCharter
      headline: XCharter
      connections: XCharter
      section_titles: XCharter
    font_size:
      body: 10pt
      name: 25pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.2em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: false
      headline: false
      connections: false
      section_titles: true
  links:
    underline: true
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: false
      display_urls_instead_of_usernames: true
      separator: '|'
      space_between_connections: 0.5cm
  section_titles:
    type: with_full_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 0.42cm
    space_between_text_based_entries: 0.15cm
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0.08cm
      space_left: 0cm
    highlights:
      bullet: ●
      nested_bullet: ●
      space_left: 0cm
      space_above: 0.08cm
      space_between_items: 0.08cm
      space_between_bullet_and_text: 0.3em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, DEGREE_WITH_AREA -- LOCATION
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- **LOCATION**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **POSITION**, COMPANY -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,harvard:`design:
  theme: harvard
  page:
    size: us-letter
    top_margin: 0.5in
    bottom_margin: 0.5in
    left_margin: 0.5in
    right_margin: 0.5in
    show_footer: true
    show_top_note: false
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 0, 0)
    headline: rgb(0, 0, 0)
    connections: rgb(0, 0, 0)
    section_titles: rgb(0, 0, 0)
    links: rgb(0, 0, 0)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: XCharter
      name: XCharter
      headline: XCharter
      connections: XCharter
      section_titles: XCharter
    font_size:
      body: 10pt
      name: 25pt
      headline: 10pt
      connections: 9pt
      section_titles: 1.3em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: true
      headline: false
      connections: false
      section_titles: true
  links:
    underline: false
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.5cm
    space_below_headline: 0.5cm
    space_below_connections: 0.5cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: false
      display_urls_instead_of_usernames: false
      separator: •
      space_between_connections: 0.4cm
  section_titles:
    type: centered_with_centered_partial_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.2cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.2cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0.15cm
      space_above: 0cm
      space_between_items: 0cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: ''
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, DEGREE_WITH_AREA -- LOCATION
        SUMMARY
        HIGHLIGHTS
      degree_column: '**DEGREE**'
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- **LOCATION**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **COMPANY**, POSITION -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,ink:`design:
  theme: ink
  page:
    size: us-letter
    top_margin: 0.6in
    bottom_margin: 0.6in
    left_margin: 0.6in
    right_margin: 0.6in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(42, 24, 82)
    headline: rgb(42, 24, 82)
    connections: rgb(70, 50, 110)
    section_titles: rgb(42, 24, 82)
    links: rgb(42, 24, 82)
    footer: rgb(120, 100, 140)
    top_note: rgb(120, 100, 140)
  typography:
    line_spacing: 0.55em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: EB Garamond
      name: EB Garamond
      headline: EB Garamond
      connections: EB Garamond
      section_titles: EB Garamond
    font_size:
      body: 10pt
      name: 32pt
      headline: 11pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: true
    bold:
      name: true
      headline: false
      connections: false
      section_titles: true
  links:
    underline: true
    show_external_link_icon: false
  header:
    alignment: left
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.5cm
    space_below_headline: 0.4cm
    space_below_connections: 0.5cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: false
      display_urls_instead_of_usernames: true
      separator: '|'
      space_between_connections: 0.4cm
  section_titles:
    type: without_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.2cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1em
    space_between_text_based_entries: 0.2em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0cm
    space_between_columns: 0.2cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0.06cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0cm
      space_above: 0.06cm
      space_between_items: 0.06cm
      space_between_bullet_and_text: 0.4em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION** -- LOCATION
        *DEGREE_WITH_AREA*
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- **LOCATION**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **COMPANY** -- LOCATION
        *POSITION*
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,moderncv:`design:
  theme: moderncv
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 79, 144)
    headline: rgb(0, 79, 144)
    connections: rgb(0, 79, 144)
    section_titles: rgb(0, 79, 144)
    links: rgb(0, 79, 144)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: Fontin
      name: Fontin
      headline: Fontin
      connections: Fontin
      section_titles: Fontin
    font_size:
      body: 10pt
      name: 25pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: false
      headline: false
      connections: false
      section_titles: false
  links:
    underline: true
    show_external_link_icon: false
  header:
    alignment: left
    photo_width: 4.15cm
    photo_position: left
    photo_space_left: 0cm
    photo_space_right: 0.3cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: true
      display_urls_instead_of_usernames: false
      separator: ''
      space_between_connections: 0.5cm
  section_titles:
    type: moderncv
    line_thickness: 0.15cm
    space_above: 0.55cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.2em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0cm
    space_between_columns: 0.3cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0.1cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0cm
      space_above: 0.15cm
      space_between_items: 0.1cm
      space_between_bullet_and_text: 0.3em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, DEGREE_WITH_AREA -- LOCATION
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- **LOCATION**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **POSITION**, COMPANY -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,opal:`design:
  theme: opal
  page:
    size: us-letter
    top_margin: 0.65in
    bottom_margin: 0.65in
    left_margin: 0.65in
    right_margin: 0.65in
    show_footer: false
    show_top_note: false
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 100, 90)
    headline: rgb(0, 80, 72)
    connections: rgb(0, 80, 72)
    section_titles: rgb(0, 100, 90)
    links: rgb(0, 100, 90)
    footer: rgb(100, 140, 135)
    top_note: rgb(100, 140, 135)
  typography:
    line_spacing: 0.6em
    alignment: left
    date_and_location_column_alignment: right
    font_family:
      body: Lato
      name: Lato
      headline: Lato
      connections: Lato
      section_titles: Lato
    font_size:
      body: 10pt
      name: 26pt
      headline: 10pt
      connections: 9pt
      section_titles: 1.2em
    small_caps:
      name: false
      headline: true
      connections: false
      section_titles: true
    bold:
      name: true
      headline: false
      connections: false
      section_titles: false
  links:
    underline: false
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.3cm
    space_below_headline: 0.3cm
    space_below_connections: 0.6cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: true
      display_urls_instead_of_usernames: false
      separator: •
      space_between_connections: 0.5cm
  section_titles:
    type: centered_without_line
    line_thickness: 0.4pt
    space_above: 0.55cm
    space_below: 0.25cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.1em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.15cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: true
    degree_width: 1cm
    summary:
      space_above: 0.04cm
      space_left: 0cm
    highlights:
      bullet: ◦
      nested_bullet: ◦
      space_left: 0.15cm
      space_above: 0.04cm
      space_between_items: 0.04cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION** -- LOCATION
        DEGREE_WITH_AREA
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: DATE
    normal_entry:
      main_column: |-
        **NAME** -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    experience_entry:
      main_column: |-
        **COMPANY**, *POSITION* -- LOCATION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,sb2nov:`design:
  theme: sb2nov
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 0, 0)
    headline: rgb(0, 0, 0)
    connections: rgb(0, 0, 0)
    section_titles: rgb(0, 0, 0)
    links: rgb(0, 0, 0)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: New Computer Modern
      name: New Computer Modern
      headline: New Computer Modern
      connections: New Computer Modern
      section_titles: New Computer Modern
    font_size:
      body: 10pt
      name: 30pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: true
      headline: false
      connections: false
      section_titles: true
  links:
    underline: true
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: false
      display_urls_instead_of_usernames: true
      separator: •
      space_between_connections: 0.5cm
  section_titles:
    type: with_full_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.2em
    space_between_text_based_entries: 0.3em
    show_time_spans_in: []
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.2cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: false
    degree_width: 1cm
    summary:
      space_above: 0cm
      space_left: 0cm
    highlights:
      bullet: ◦
      nested_bullet: ◦
      space_left: 0.15cm
      space_above: 0cm
      space_between_items: 0cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**
        *DEGREE* *in* *AREA*
        SUMMARY
        HIGHLIGHTS
      degree_column:
      date_and_location_column: |-
        *LOCATION*
        *DATE*
    normal_entry:
      main_column: |-
        **NAME**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        *LOCATION*
        *DATE*
    experience_entry:
      main_column: |-
        **POSITION**
        *COMPANY*
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        *LOCATION*
        *DATE*
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`},br={english:`locale:
  language: english
  last_updated: Last updated in
  month: month
  months: months
  year: year
  years: years
  present: present
  phrases:
    degree_with_area: DEGREE in AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - May
    - June
    - July
    - Aug
    - Sept
    - Oct
    - Nov
    - Dec
  month_names:
    - January
    - February
    - March
    - April
    - May
    - June
    - July
    - August
    - September
    - October
    - November
    - December
`,arabic:`locale:
  language: arabic
  last_updated: آخر تحديث في
  month: شهر
  months: أشهر
  year: سنة
  years: سنوات
  present: الحاضر
  phrases:
    degree_with_area: DEGREE في AREA
  month_abbreviations:
    - ينا
    - فبر
    - مار
    - أبر
    - ماي
    - يون
    - يول
    - أغس
    - سبت
    - أكت
    - نوف
    - ديس
  month_names:
    - يناير
    - فبراير
    - مارس
    - أبريل
    - مايو
    - يونيو
    - يوليو
    - أغسطس
    - سبتمبر
    - أكتوبر
    - نوفمبر
    - ديسمبر
`,danish:`locale:
  language: danish
  last_updated: Senest opdateret
  month: måned
  months: måneder
  year: år
  years: år
  present: nuværende
  phrases:
    degree_with_area: DEGREE i AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - Maj
    - Jun
    - Jul
    - Aug
    - Sep
    - Okt
    - Nov
    - Dec
  month_names:
    - Januar
    - Februar
    - Marts
    - April
    - Maj
    - Juni
    - Juli
    - August
    - September
    - Oktober
    - November
    - December
`,dutch:`locale:
  language: dutch
  last_updated: Laatst bijgewerkt
  month: maand
  months: maanden
  year: jaar
  years: jaren
  present: heden
  phrases:
    degree_with_area: DEGREE in AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mrt
    - Apr
    - Mei
    - Jun
    - Jul
    - Aug
    - Sep
    - Okt
    - Nov
    - Dec
  month_names:
    - Januari
    - Februari
    - Maart
    - April
    - Mei
    - Juni
    - Juli
    - Augustus
    - September
    - Oktober
    - November
    - December
`,french:`locale:
  language: french
  last_updated: Dernière mise à jour
  month: mois
  months: mois
  year: an
  years: ans
  present: présent
  phrases:
    degree_with_area: DEGREE en AREA
  month_abbreviations:
    - Jan
    - Fév
    - Mar
    - Avr
    - Mai
    - Juin
    - Juil
    - Aoû
    - Sep
    - Oct
    - Nov
    - Déc
  month_names:
    - Janvier
    - Février
    - Mars
    - Avril
    - Mai
    - Juin
    - Juillet
    - Août
    - Septembre
    - Octobre
    - Novembre
    - Décembre
`,german:`locale:
  language: german
  last_updated: Zuletzt aktualisiert
  month: Monat
  months: Monate
  year: Jahr
  years: Jahre
  present: gegenwärtig
  phrases:
    degree_with_area: DEGREE in AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mär
    - Apr
    - Mai
    - Jun
    - Jul
    - Aug
    - Sep
    - Okt
    - Nov
    - Dez
  month_names:
    - Januar
    - Februar
    - März
    - April
    - Mai
    - Juni
    - Juli
    - August
    - September
    - Oktober
    - November
    - Dezember
`,hebrew:`locale:
  language: hebrew
  last_updated: עודכן לאחרונה ב
  month: חודש
  months: חודשים
  year: שנה
  years: שנים
  present: הווה
  phrases:
    degree_with_area: DEGREE בAREA
  month_abbreviations:
    - ינו'
    - פבר'
    - מרץ
    - אפר'
    - מאי
    - יוני
    - יולי
    - אוג'
    - ספט'
    - אוק'
    - נוב'
    - דצמ'
  month_names:
    - ינואר
    - פברואר
    - מרץ
    - אפריל
    - מאי
    - יוני
    - יולי
    - אוגוסט
    - ספטמבר
    - אוקטובר
    - נובמבר
    - דצמבר
`,hindi:`locale:
  language: hindi
  last_updated: अंतिम अद्यतन
  month: महीना
  months: महीने
  year: वर्ष
  years: वर्ष
  present: वर्तमान
  phrases:
    degree_with_area: AREA में DEGREE
  month_abbreviations:
    - जन
    - फर
    - मार
    - अप्र
    - मई
    - जून
    - जुल
    - अग
    - सित
    - अक्ट
    - नव
    - दिस
  month_names:
    - जनवरी
    - फरवरी
    - मार्च
    - अप्रैल
    - मई
    - जून
    - जुलाई
    - अगस्त
    - सितंबर
    - अक्टूबर
    - नवंबर
    - दिसंबर
`,hungarian:`locale:
  language: hungarian
  last_updated: Utoljára frissítve
  month: hónap
  months: hónap
  year: év
  years: év
  present: jelenleg
  phrases:
    degree_with_area: DEGREE AREA szakon
  month_abbreviations:
    - Jan
    - Febr
    - Márc
    - Ápr
    - Máj
    - Jún
    - Júl
    - Aug
    - Szept
    - Okt
    - Nov
    - Dec
  month_names:
    - Január
    - Február
    - Március
    - Április
    - Május
    - Június
    - Július
    - Augusztus
    - Szeptember
    - Október
    - November
    - December
`,indonesian:`locale:
  language: indonesian
  last_updated: Terakhir diperbarui
  month: bulan
  months: bulan
  year: tahun
  years: tahun
  present: sekarang
  phrases:
    degree_with_area: DEGREE di AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - Mei
    - Jun
    - Jul
    - Agu
    - Sep
    - Okt
    - Nov
    - Des
  month_names:
    - Januari
    - Februari
    - Maret
    - April
    - Mei
    - Juni
    - Juli
    - Agustus
    - September
    - Oktober
    - November
    - Desember
`,italian:`locale:
  language: italian
  last_updated: Ultimo aggiornamento
  month: mese
  months: mesi
  year: anno
  years: anni
  present: presente
  phrases:
    degree_with_area: DEGREE in AREA
  month_abbreviations:
    - Gen
    - Feb
    - Mar
    - Apr
    - Mag
    - Giu
    - Lug
    - Ago
    - Set
    - Ott
    - Nov
    - Dic
  month_names:
    - Gennaio
    - Febbraio
    - Marzo
    - Aprile
    - Maggio
    - Giugno
    - Luglio
    - Agosto
    - Settembre
    - Ottobre
    - Novembre
    - Dicembre
`,japanese:`locale:
  language: japanese
  last_updated: 最終更新
  month: 月
  months: ヶ月
  year: 年
  years: 年
  present: 現在
  phrases:
    degree_with_area: AREA DEGREE
  month_abbreviations:
    - 1月
    - 2月
    - 3月
    - 4月
    - 5月
    - 6月
    - 7月
    - 8月
    - 9月
    - 10月
    - 11月
    - 12月
  month_names:
    - 1月
    - 2月
    - 3月
    - 4月
    - 5月
    - 6月
    - 7月
    - 8月
    - 9月
    - 10月
    - 11月
    - 12月
`,korean:`locale:
  language: korean
  last_updated: 마지막 업데이트
  month: 월
  months: 개월
  year: 년
  years: 년
  present: 현재
  phrases:
    degree_with_area: AREA DEGREE
  month_abbreviations:
    - 1월
    - 2월
    - 3월
    - 4월
    - 5월
    - 6월
    - 7월
    - 8월
    - 9월
    - 10월
    - 11월
    - 12월
  month_names:
    - 1월
    - 2월
    - 3월
    - 4월
    - 5월
    - 6월
    - 7월
    - 8월
    - 9월
    - 10월
    - 11월
    - 12월
`,mandarin_chinese:`locale:
  language: mandarin_chinese
  last_updated: 最后更新于
  month: 个月
  months: 个月
  year: 年
  years: 年
  present: 至今
  phrases:
    degree_with_area: AREA DEGREE
  month_abbreviations:
    - 1月
    - 2月
    - 3月
    - 4月
    - 5月
    - 6月
    - 7月
    - 8月
    - 9月
    - 10月
    - 11月
    - 12月
  month_names:
    - 一月
    - 二月
    - 三月
    - 四月
    - 五月
    - 六月
    - 七月
    - 八月
    - 九月
    - 十月
    - 十一月
    - 十二月
`,norwegian_bokmål:`locale:
  language: norwegian_bokmål
  last_updated: Sist oppdatert
  month: måned
  months: måneder
  year: år
  years: år
  present: nåværende
  phrases:
    degree_with_area: DEGREE i AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - Mai
    - Jun
    - Jul
    - Aug
    - Sep
    - Okt
    - Nov
    - Des
  month_names:
    - Januar
    - Februar
    - Mars
    - April
    - Mai
    - Juni
    - Juli
    - August
    - September
    - Oktober
    - November
    - Desember
`,norwegian_nynorsk:`locale:
  language: norwegian_nynorsk
  last_updated: Sist oppdatert
  month: månad
  months: månader
  year: år
  years: år
  present: nåverande
  phrases:
    degree_with_area: DEGREE i AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - Mai
    - Jun
    - Jul
    - Aug
    - Sep
    - Okt
    - Nov
    - Des
  month_names:
    - Januar
    - Februar
    - Mars
    - April
    - Mai
    - Juni
    - Juli
    - August
    - September
    - Oktober
    - November
    - Desember
`,persian:`locale:
  language: persian
  last_updated: آخرین به‌روزرسانی در
  month: ماه
  months: ماه
  year: سال
  years: سال
  present: حال
  phrases:
    degree_with_area: DEGREE در AREA
  month_abbreviations:
    - ژان
    - فور
    - مار
    - آور
    - مه
    - ژون
    - ژول
    - اوت
    - سپت
    - اکت
    - نوا
    - دسا
  month_names:
    - ژانویه
    - فوریه
    - مارس
    - آوریل
    - مه
    - ژوئن
    - ژوئیه
    - اوت
    - سپتامبر
    - اکتبر
    - نوامبر
    - دسامبر
`,portuguese:`locale:
  language: portuguese
  last_updated: Última atualização
  month: mês
  months: meses
  year: ano
  years: anos
  present: presente
  phrases:
    degree_with_area: DEGREE em AREA
  month_abbreviations:
    - Jan
    - Fev
    - Mar
    - Abr
    - Mai
    - Jun
    - Jul
    - Ago
    - Set
    - Out
    - Nov
    - Dez
  month_names:
    - Janeiro
    - Fevereiro
    - Março
    - Abril
    - Maio
    - Junho
    - Julho
    - Agosto
    - Setembro
    - Outubro
    - Novembro
    - Dezembro
`,russian:`locale:
  language: russian
  last_updated: Последнее обновление
  month: месяц
  months: месяцы
  year: год
  years: лет
  present: настоящее время
  phrases:
    degree_with_area: DEGREE в AREA
  month_abbreviations:
    - Янв
    - Фев
    - Мар
    - Апр
    - Май
    - Июн
    - Июл
    - Авг
    - Сен
    - Окт
    - Ноя
    - Дек
  month_names:
    - Январь
    - Февраль
    - Март
    - Апрель
    - Май
    - Июнь
    - Июль
    - Август
    - Сентябрь
    - Октябрь
    - Ноябрь
    - Декабрь
`,spanish:`locale:
  language: spanish
  last_updated: Última actualización
  month: mes
  months: meses
  year: año
  years: años
  present: presente
  phrases:
    degree_with_area: DEGREE en AREA
  month_abbreviations:
    - Ene
    - Feb
    - Mar
    - Abr
    - May
    - Jun
    - Jul
    - Ago
    - Sep
    - Oct
    - Nov
    - Dic
  month_names:
    - Enero
    - Febrero
    - Marzo
    - Abril
    - Mayo
    - Junio
    - Julio
    - Agosto
    - Septiembre
    - Octubre
    - Noviembre
    - Diciembre
`,turkish:`locale:
  language: turkish
  last_updated: Son güncelleme
  month: ay
  months: ay
  year: yıl
  years: yıl
  present: halen
  phrases:
    degree_with_area: AREA, DEGREE
  month_abbreviations:
    - Oca
    - Şub
    - Mar
    - Nis
    - May
    - Haz
    - Tem
    - Ağu
    - Eyl
    - Eki
    - Kas
    - Ara
  month_names:
    - Ocak
    - Şubat
    - Mart
    - Nisan
    - Mayıs
    - Haziran
    - Temmuz
    - Ağustos
    - Eylül
    - Ekim
    - Kasım
    - Aralık
`,vietnamese:`locale:
  language: vietnamese
  last_updated: Cập nhật lần cuối vào
  month: tháng
  months: tháng
  year: năm
  years: năm
  present: hiện tại
  phrases:
    degree_with_area: DEGREE ngành AREA
  month_abbreviations:
    - Th01
    - Th02
    - Th03
    - Th04
    - Th05
    - Th06
    - Th07
    - Th08
    - Th09
    - Th10
    - Th11
    - Th12
  month_names:
    - Tháng Một
    - Tháng Hai
    - Tháng Ba
    - Tháng Tư
    - Tháng Năm
    - Tháng Sáu
    - Tháng Bảy
    - Tháng Tám
    - Tháng Chín
    - Tháng Mười
    - Tháng Mười Một
    - Tháng Mười Hai
`},Kr={classic:"Classic",ember:"Ember",engineeringclassic:"Engineering Classic",engineeringresumes:"Engineering Resumes",harvard:"Harvard",ink:"Ink",moderncv:"ModernCV",opal:"Opal",sb2nov:"Sb2nov"},qr={english:{flag:"🇬🇧",name:"English"},arabic:{flag:"🇸🇦",name:"Arabic"},danish:{flag:"🇩🇰",name:"Danish"},dutch:{flag:"🇳🇱",name:"Dutch"},french:{flag:"🇫🇷",name:"French"},german:{flag:"🇩🇪",name:"German"},hebrew:{flag:"🇮🇱",name:"Hebrew"},hindi:{flag:"🇮🇳",name:"Hindi"},hungarian:{flag:"🇭🇺",name:"Hungarian"},indonesian:{flag:"🇮🇩",name:"Indonesian"},italian:{flag:"🇮🇹",name:"Italian"},japanese:{flag:"🇯🇵",name:"Japanese"},korean:{flag:"🇰🇷",name:"Korean"},mandarin_chinese:{flag:"🇨🇳",name:"Mandarin Chinese"},norwegian_bokmål:{flag:"🇳🇴",name:"Norwegian Bokmål"},norwegian_nynorsk:{flag:"🇳🇴",name:"Norwegian Nynorsk"},persian:{flag:"🇮🇷",name:"Persian"},portuguese:{flag:"🇵🇹",name:"Portuguese"},russian:{flag:"🇷🇺",name:"Russian"},spanish:{flag:"🇪🇸",name:"Spanish"},turkish:{flag:"🇹🇷",name:"Turkish"},vietnamese:{flag:"🇻🇳",name:"Vietnamese"}},Bn=[{id:"gemini-3.6-flash",label:"Gemini 3.6 Flash",provider:"google",minTier:"free",cost:1},{id:"gemini-3.1-pro-preview",label:"Gemini 3.1 Pro",provider:"google",minTier:"plus",cost:2},{id:"claude-sonnet-5",label:"Claude Sonnet 5",provider:"anthropic",minTier:"plus",cost:2},{id:"claude-opus-4-8",label:"Claude Opus 4.8",provider:"anthropic",minTier:"plus",cost:3}],Xr="gemini-3.6-flash";new Set(Bn.map(t=>t.id));Object.fromEntries(Bn.map(t=>[t.id,t.minTier]));function Yn(){if(typeof crypto<"u"&&typeof crypto.randomUUID=="function")return crypto.randomUUID();const t=crypto.getRandomValues(new Uint8Array(16));t[6]=t[6]&15|64,t[8]=t[8]&63|128;const e=Array.from(t,n=>n.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}const z={classic:{cv:`cv:
  name: John Doe
  headline:
  location: San Francisco, CA
  email: john.doe@email.com
  photo:
  phone:
  website: https://rendercv.com/
  social_networks:
    - network: LinkedIn
      username: rendercv
    - network: GitHub
      username: rendercv
  custom_connections:
  sections:
    Welcome to RenderCV:
      - RenderCV reads a CV written in a YAML file, and generates a PDF with professional typography.
      - Each section title is arbitrary.
      - You can choose any of the 9 entry types for each section.
      - Markdown syntax is supported everywhere. This is **bold**, *italic*, and [link](https://example.com).
    education:
      - institution: Princeton University
        area: Computer Science
        degree: PhD
        date:
        start_date: 2018-09
        end_date: 2023-05
        location: Princeton, NJ
        summary:
        highlights:
          - 'Thesis: Efficient Neural Architecture Search for Resource-Constrained Deployment'
          - 'Advisor: Prof. Sanjeev Arora'
          - NSF Graduate Research Fellowship, Siebel Scholar (Class of 2022)
      - institution: Boğaziçi University
        area: Computer Engineering
        degree: BS
        date:
        start_date: 2014-09
        end_date: 2018-06
        location: Istanbul, Türkiye
        summary:
        highlights:
          - 'GPA: 3.97/4.00, Valedictorian'
          - Fulbright Scholarship recipient for Graduate Studies
    experience:
      - company: Nexus AI
        position: Co-Founder & CTO
        date:
        start_date: 2023-06
        end_date: present
        location: San Francisco, CA
        summary:
        highlights:
          - Built foundation model infrastructure serving 2M+ monthly API requests with 99.97% uptime
          - Raised $18M Series A led by Sequoia Capital, with participation from a16z and Founders Fund
          - Scaled engineering team from 3 to 28 across ML research, platform, and applied AI divisions
          - Developed proprietary inference optimization reducing latency by 73% compared to baseline
      - company: NVIDIA Research
        position: Research Intern
        date:
        start_date: 2022-05
        end_date: 2022-08
        location: Santa Clara, CA
        summary:
        highlights:
          - Designed sparse attention mechanism reducing transformer memory footprint by 4.2x
          - Co-authored paper accepted at NeurIPS 2022 (spotlight presentation, top 5% of submissions)
      - company: Google DeepMind
        position: Research Intern
        date:
        start_date: 2021-05
        end_date: 2021-08
        location: London, UK
        summary:
        highlights:
          - Developed reinforcement learning algorithms for multi-agent coordination
          - Published research at top-tier venues with significant academic impact
            - ICML 2022 main conference paper, cited 340+ times within two years
            - NeurIPS 2022 workshop paper on emergent communication protocols
            - Invited journal extension in JMLR (2023)
      - company: Apple ML Research
        position: Research Intern
        date:
        start_date: 2020-05
        end_date: 2020-08
        location: Cupertino, CA
        summary:
        highlights:
          - Created on-device neural network compression pipeline deployed across 50M+ devices
          - Filed 2 patents on efficient model quantization techniques for edge inference
      - company: Microsoft Research
        position: Research Intern
        date:
        start_date: 2019-05
        end_date: 2019-08
        location: Redmond, WA
        summary:
        highlights:
          - Implemented novel self-supervised learning framework for low-resource language modeling
          - Research integrated into Azure Cognitive Services, reducing training data requirements by 60%
    projects:
      - name: '[FlashInfer](https://github.com/)'
        date:
        start_date: 2023-01
        end_date: present
        location:
        summary: Open-source library for high-performance LLM inference kernels
        highlights:
          - Achieved 2.8x speedup over baseline attention implementations on A100 GPUs
          - Adopted by 3 major AI labs, 8,500+ GitHub stars, 200+ contributors
      - name: '[NeuralPrune](https://github.com/)'
        date: '2021'
        start_date:
        end_date:
        location:
        summary: Automated neural network pruning toolkit with differentiable masks
        highlights:
          - Reduced model size by 90% with less than 1% accuracy degradation on ImageNet
          - Featured in PyTorch ecosystem tools, 4,200+ GitHub stars
    publications:
      - title: 'Sparse Mixture-of-Experts at Scale: Efficient Routing for Trillion-Parameter Models'
        authors:
          - '*John Doe*'
          - Sarah Williams
          - David Park
        summary:
        doi: 10.1234/neurips.2023.1234
        url:
        journal: NeurIPS 2023
        date: 2023-07
      - title: Neural Architecture Search via Differentiable Pruning
        authors:
          - James Liu
          - '*John Doe*'
        summary:
        doi: 10.1234/neurips.2022.5678
        url:
        journal: NeurIPS 2022, Spotlight
        date: 2022-12
      - title: Multi-Agent Reinforcement Learning with Emergent Communication
        authors:
          - Maria Garcia
          - '*John Doe*'
          - Tom Anderson
        summary:
        doi: 10.1234/icml.2022.9012
        url:
        journal: ICML 2022
        date: 2022-07
      - title: On-Device Model Compression via Learned Quantization
        authors:
          - '*John Doe*'
          - Kevin Wu
        summary:
        doi: 10.1234/iclr.2021.3456
        url:
        journal: ICLR 2021, Best Paper Award
        date: 2021-05
    selected_honors:
      - bullet: MIT Technology Review 35 Under 35 Innovators (2024)
      - bullet: Forbes 30 Under 30 in Enterprise Technology (2024)
      - bullet: ACM Doctoral Dissertation Award Honorable Mention (2023)
      - bullet: Google PhD Fellowship in Machine Learning (2020 – 2023)
      - bullet: Fulbright Scholarship for Graduate Studies (2018)
    skills:
      - label: Languages
        details: Python, C++, CUDA, Rust, Julia
      - label: ML Frameworks
        details: PyTorch, JAX, TensorFlow, Triton, ONNX
      - label: Infrastructure
        details: Kubernetes, Ray, distributed training, AWS, GCP
      - label: Research Areas
        details: Neural architecture search, model compression, efficient inference, multi-agent RL
    patents:
      - number: Adaptive Quantization for Neural Network Inference on Edge Devices (US Patent 11,234,567)
      - number: Dynamic Sparsity Patterns for Efficient Transformer Attention (US Patent 11,345,678)
      - number: Hardware-Aware Neural Architecture Search Method (US Patent 11,456,789)
    invited_talks:
      - reversed_number: Scaling Laws for Efficient Inference — Stanford HAI Symposium (2024)
      - reversed_number: Building AI Infrastructure for the Next Decade — TechCrunch Disrupt (2024)
      - reversed_number: 'From Research to Production: Lessons in ML Systems — NeurIPS Workshop (2023)'
      - reversed_number: "Efficient Deep Learning: A Practitioner's Perspective — Google Tech Talk (2022)"
`,design:`design:
  theme: classic
  page:
    size: us-letter
    top_margin: 0.7in
    bottom_margin: 0.7in
    left_margin: 0.7in
    right_margin: 0.7in
    show_footer: true
    show_top_note: true
  colors:
    body: rgb(55, 65, 81)
    name: rgb(0, 79, 144)
    headline: rgb(0, 79, 144)
    connections: rgb(0, 79, 144)
    section_titles: rgb(0, 79, 144)
    links: rgb(0, 79, 144)
    footer: rgb(128, 128, 128)
    top_note: rgb(128, 128, 128)
  typography:
    line_spacing: 0.6em
    alignment: justified
    date_and_location_column_alignment: right
    font_family:
      body: Source Sans 3
      name: Source Sans 3
      headline: Source Sans 3
      connections: Source Sans 3
      section_titles: Source Sans 3
    font_size:
      body: 10pt
      name: 30pt
      headline: 10pt
      connections: 10pt
      section_titles: 1.4em
    small_caps:
      name: false
      headline: false
      connections: false
      section_titles: false
    bold:
      name: true
      headline: false
      connections: false
      section_titles: true
  links:
    underline: false
    show_external_link_icon: false
  header:
    alignment: center
    photo_width: 3.5cm
    photo_position: left
    photo_space_left: 0.4cm
    photo_space_right: 0.4cm
    space_below_name: 0.7cm
    space_below_headline: 0.7cm
    space_below_connections: 0.7cm
    connections:
      phone_number_format: national
      hyperlink: true
      show_icons: true
      display_urls_instead_of_usernames: false
      separator: ''
      space_between_connections: 0.5cm
  section_titles:
    type: with_partial_line
    line_thickness: 0.5pt
    space_above: 0.5cm
    space_below: 0.3cm
  sections:
    allow_page_break: true
    space_between_regular_entries: 1.2em
    space_between_text_based_entries: 0.3em
    show_time_spans_in:
      - experience
  entries:
    date_and_location_width: 4.15cm
    side_space: 0.2cm
    space_between_columns: 0.1cm
    allow_page_break: false
    short_second_row: true
    degree_width: 1cm
    summary:
      space_above: 0cm
      space_left: 0cm
    highlights:
      bullet: •
      nested_bullet: •
      space_left: 0.15cm
      space_above: 0cm
      space_between_items: 0cm
      space_between_bullet_and_text: 0.5em
  templates:
    footer: '*NAME -- PAGE_NUMBER/TOTAL_PAGES*'
    top_note: '*LAST_UPDATED CURRENT_DATE*'
    single_date: MONTH_ABBREVIATION YEAR
    date_range: START_DATE – END_DATE
    time_span: HOW_MANY_YEARS YEARS HOW_MANY_MONTHS MONTHS
    one_line_entry:
      main_column: '**LABEL:** DETAILS'
    education_entry:
      main_column: |-
        **INSTITUTION**, AREA
        SUMMARY
        HIGHLIGHTS
      degree_column: '**DEGREE**'
      date_and_location_column: |-
        LOCATION
        DATE
    normal_entry:
      main_column: |-
        **NAME**
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        LOCATION
        DATE
    experience_entry:
      main_column: |-
        **COMPANY**, POSITION
        SUMMARY
        HIGHLIGHTS
      date_and_location_column: |-
        LOCATION
        DATE
    publication_entry:
      main_column: |-
        **TITLE**
        SUMMARY
        AUTHORS
        URL (JOURNAL)
      date_and_location_column: DATE
`,locale:`locale:
  language: english
  last_updated: Last updated in
  month: month
  months: months
  year: year
  years: years
  present: present
  phrases:
    degree_with_area: DEGREE in AREA
  month_abbreviations:
    - Jan
    - Feb
    - Mar
    - Apr
    - May
    - June
    - July
    - Aug
    - Sept
    - Oct
    - Nov
    - Dec
  month_names:
    - January
    - February
    - March
    - April
    - May
    - June
    - July
    - August
    - September
    - October
    - November
    - December
`,settings:`settings:
  current_date: today
  bold_keywords: []
  pdf_title: NAME - CV
`}};

export const THEME_IDS = zr as readonly string[];
export const LOCALE_IDS = Vr as readonly string[];
export const THEME_DESIGNS: Record<string, string> = gr;
export const LOCALE_YAMLS: Record<string, string> = br;
export const THEME_LABELS: Record<string, string> = Kr;
export const LOCALE_META: Record<string, { flag: string; name: string }> = qr;
export const DEFAULT_CV_TEMPLATE: { cv: string; design: string; locale: string; settings: string } = z.classic;
export { Yn as generateUUID };
