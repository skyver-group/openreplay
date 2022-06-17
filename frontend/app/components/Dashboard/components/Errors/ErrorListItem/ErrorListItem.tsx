import React from 'react';
import cn from 'classnames';
import moment from 'moment';
import { error as errorRoute } from 'App/routes';
import { IGNORED, RESOLVED } from 'Types/errorInfo';
import { Link, Label } from 'UI';
import ErrorName from '../ErrorName';
import ErrorLabel from '../ErrorLabel';
import { BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts';
import { Styles } from '../../../Widgets/common';
import { diffFromNowString } from 'App/date';

interface Props {
    error: any;
    className?: string;
}
function ErrorListItem(props: Props) {
    const { error, className = '' } = props;
    return (
        <div
			className={ cn("border p-3 flex justify-between cursor-pointer py-4 hover:bg-active-blue mb-3", className) }
			id="error-item"
		>
			<div className={ cn("flex-1 leading-tight") } >
				<div>
					<ErrorName
						icon={error.status === IGNORED ? 'ban' : null }
						lineThrough={error.status === RESOLVED}
						name={ error.name }
						message={ error.stack0InfoString }
						bold={ !error.viewed }
					/>
                    <div className={ cn("truncate color-gray-medium", { "line-through" : error.status === RESOLVED}) }>
                        { error.message }
                    </div>
				</div>
			</div>
			<BarChart width={ 150 } height={ 40 } data={ error.chart }>
				<XAxis hide dataKey="timestamp"  />
				<YAxis hide domain={[0, 'dataMax + 8']} />
				<Tooltip {...Styles.tooltip} label="Sessions" content={<CustomTooltip />} />
		        <Bar name="Sessions" minPointSize={1} dataKey="count" fill="#A8E0DA" />
		    </BarChart>
			<ErrorLabel 
				// className={stl.sessions}
				topValue={ error.sessions }
				bottomValue="Sessions"
			/>
			<ErrorLabel
				// className={stl.users}
				topValue={ error.users }
				bottomValue="Users"
			/>
			<ErrorLabel
				// className={stl.occurrence}
				topValue={ `${error.lastOccurrence && diffFromNowString(error.lastOccurrence)} ago` }
				bottomValue="Last Seen"
			/>
		</div>
    );
}

export default ErrorListItem;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active) {
      const p = payload[0].payload;
      return (
        <div className="rounded border bg-white p-2">
          <p className="label text-sm color-gray-medium">{`${p.timestamp ? moment(p.timestamp).format('l') : ''}`}</p>
          <p className="text-sm">Sessions: {p.count}</p>
        </div>
      );
    }
  
    return null;
  };