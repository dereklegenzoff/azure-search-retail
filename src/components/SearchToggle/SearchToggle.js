import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import './SearchToggle.css';

export default function SearchToggle(props) {

    return (
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={props.checked ?? false} onChange={props.onChange} color="primary" />}
                    label="Enable Semantic Search"
                    labelPlacement="start"
                />
            </FormGroup>
    );

}