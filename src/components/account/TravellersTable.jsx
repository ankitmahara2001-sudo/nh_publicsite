import { GENDER_LABELS } from '@/domain/enums';
import { DetailSection } from './DetailSection';

const CELL = 'px-3 py-3 first:pl-0 last:pr-0';

export function TravellersTable({ travellers }) {
  return (
    <DetailSection title="Travellers">
      {travellers.length === 0 ? (
        <p className="text-sm text-muted">Traveller details have not been added.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm lg:text-[15px]">
            <thead className="text-xs text-muted lg:text-[13px]">
              <tr className="border-b border-line">
                <th scope="col" className={`${CELL} font-semibold`}>
                  Name
                </th>
                <th scope="col" className={`${CELL} font-semibold`}>
                  Age
                </th>
                <th scope="col" className={`${CELL} font-semibold`}>
                  Gender
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {travellers.map((traveller, index) => (
                <tr key={`${traveller.fullName}-${index}`}>
                  <td className={`${CELL} font-semibold`}>
                    {traveller.fullName}
                    {traveller.isLead && <span className="ml-2 text-xs font-bold text-gold-text">Lead</span>}
                  </td>
                  <td className={CELL}>{traveller.age}</td>
                  <td className={CELL}>{GENDER_LABELS[traveller.gender]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DetailSection>
  );
}
