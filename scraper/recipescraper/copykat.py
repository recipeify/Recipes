# copykat.py
# Written by G.D. Wallters
# Freely released the code to recipe_scraper group
# 8 February, 2020
# =======================================================
from ._abstract import AbstractScraper
from ._utils import normalize_string


class CopyKat(AbstractScraper):

    @classmethod
    def host(self):
        return 'copykat.com'

    def title(self):
        return normalize_string(self.soup.find('h1').get_text())

    def total_time(self):
        total_time = 0
        tt = self.soup.find(
            'div',
            {
                'class' : 'wprm-recipe-block-container wprm-recipe-block-container-inline wprm-block-text-normal wprm-recipe-time-container wprm-recipe-total-time-container'
            })
        if tt:
            tt1 = self.soup.find(
                'span',
                {
                    'class': "wprm-recipe-details wprm-recipe-details-hours wprm-recipe-total_time wprm-recipe-total_time-hours"}
            )
            if not tt1:
                tt1 = 0
            else:
                tt1 = tt1.get_text()
            tt2 = self.soup.find(
                'span',
                {
                    'class': 'wprm-recipe-details wprm-recipe-details-minutes wprm-recipe-total_time wprm-recipe-total_time-minutes'}
            )
            if not tt2:
                tt2 = 0
            else:
                tt2 = tt2.get_text()
            tt3 = (int(tt1) * 60) + int(tt2)
            if tt3 != 0:
                return tt3

        pt = self.soup.find(
            'div',
            {
                'class': 'wprm-recipe-block-container wprm-recipe-block-container-inline wprm-block-text-normal wprm-recipe-time-container wprm-recipe-prep-time-container'
            })
        if pt:
            pt1 = self.soup.find(
                'span',
                {
                    'class': "wprm-recipe-details wprm-recipe-details-hours wprm-recipe-prep_time wprm-recipe-prep_time-hours"}
            )
            if not pt1:
                pt1 = 0
            else:
                pt1 = pt1.get_text()
            pt2 = self.soup.find(
                'span',
                {
                    'class': 'wprm-recipe-details wprm-recipe-details-minutes wprm-recipe-prep_time wprm-recipe-prep_time-minutes'}
            )
            if not pt2:
                pt2 = 0
            else:
                pt2 = pt2.get_text()
            pt3 = (int(pt1) * 60) + int(pt2)
        else:
            pt3 = 0

        ct = self.soup.find(
            'div',
            {
                'class': 'wprm-recipe-block-container wprm-recipe-block-container-inline wprm-block-text-normal wprm-recipe-time-container wprm-recipe-cook-time-container'
            })
        if ct:
            ct1 = self.soup.find(
                'span',
                {
                    'class': "wprm-recipe-details wprm-recipe-details-hours wprm-recipe-cook_time wprm-recipe-cook_time-hours"}
            )
            if not ct1:
                ct1 = 0
            else:
                ct1 = ct1.get_text()
            ct2 = self.soup.find(
                'span',
                {
                    'class': 'wprm-recipe-details wprm-recipe-details-minutes wprm-recipe-cook_time wprm-recipe-cook_time-minutes'}
            )
            if not ct2:
                ct2 = 0
            else:
                ct2 = ct2.get_text()
            ct3 = (int(ct1) * 60) + int(ct2)
        else:
            ct3 = 0
        return pt3 + ct3

    def yields(self):
        recipe_yield = self.soup.find(
            'div',
            {
                'class': "wprm-recipe-servings-container wprm-recipe-block-container wprm-recipe-block-container-inline wprm-block-text-normal"}
        ).get_text()
        if 'Servings:' in recipe_yield:
            ry = normalize_string(recipe_yield[9:])
        return ry

    def image(self):
        image = self.soup.find(
            "div", {"class": "wprm-recipe-image wprm-block-image-rounded"})  # , 'src': True})
        lnk = image.find('a', href=True)
        if lnk:
            isrc = lnk['href']
        return isrc if image else None

    def ingredients(self):
        ingredientsOuter = self.soup.findAll(
            'div',
            {'class': 'wprm-recipe-ingredient-group'}
        )

        ingGroup = []
        for ig in ingredientsOuter:
            try:
                header = ig.find('h4', {
                    'class': "wprm-recipe-group-name wprm-recipe-ingredient-group-name wprm-block-text-bold"}).text
            except Exception:
                header = None
            if header != None:
                ingGroup.append(header)
            ingredparts = ig.findAll('li')
            for i in ingredparts:
                x = normalize_string(i.get_text())
                ingGroup.append(x)
        return ingGroup

    def instructions(self):
        instructions = self.soup.findAll(
            'div',
            {'class': 'wprm-recipe-instruction-group'})
        data = []
        if len(instructions):
            for instruct in instructions:
                try:
                    header = instruct.find(
                        'h4',
                        {
                            'class': 'wprm-recipe-group-name wprm-recipe-instruction-group-name wprm-block-text-bold'}).text
                except Exception:
                    header = None
                if header != None:
                    data.append(header)
                ins = instruct.findAll(
                    'div', {'class': 'wprm-recipe-instruction-text'})
                data.append('\n'.join([normalize_string(inst.text)
                                       for inst in ins
                                       ]))
            return data

    def ratings(self):
        r1 = round(float(self.soup.find(
            'span',
            {'class': 'wprm-recipe-rating-average'}
        ).get_text()) / 5.0, 2)
        return r1

    def number_of_raters(self):
        return int(
            self.soup.find(
                "span",
                {"class": "wprm-recipe-rating-count"}
            ).get_text())

    def description(self):
        d = normalize_string(self.soup.find(
            'span',
            {'style': 'display: block;'}).text)

        return d if d else None

    def tags(self):
        tags = self.soup.findAll(
            'a',
            {'rel': 'category tag'}
        )
        tags = [
            normalize_string(tag.get_text())
            for tag in tags
        ]

        tags.append(normalize_string(self.soup.find(
            "span", {"class": "wprm-recipe-cuisine wprm-block-text-normal"}
        ).get_text()))

        tags.append(normalize_string(self.soup.find(
            "span", {"class": "wprm-recipe-course wprm-block-text-normal"}
        ).get_text()))
        return tags

    def id(self):
        return self.soup.find(
            'div',
            {'class': 'wprm-recipe-container'}
        )['data-recipe-id']
