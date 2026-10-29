import { useState } from 'react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { AlertCircle, Smartphone, Globe, Volume2, UserX, MessageSquare } from 'lucide-react';

const SUGGESTED_REASONS = [
  { label: 'Phone', icon: Smartphone },
  { label: 'Social media', icon: Globe },
  { label: 'Noise', icon: Volume2 },
  { label: 'Unrelated browsing', icon: Globe },
  { label: 'Personal interruption', icon: UserX },
  { label: 'Other', icon: MessageSquare },
];

interface DistractionButtonProps {
  disabled?: boolean;
  onRecord: (reason?: string) => void;
}

export function DistractionButton({ disabled, onRecord }: DistractionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');

  const handleRecord = (reasonToSave?: string) => {
    const finalReason = reasonToSave !== undefined 
      ? reasonToSave 
      : (customReason.trim() || selectedReason || undefined);
    onRecord(finalReason);
    setSelectedReason('');
    setCustomReason('');
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => setShowModal(true)}
        icon={<AlertCircle className="h-4 w-4 text-[#B47A35]" />}
        className="text-ink hover:text-ink font-medium"
      >
        Record Distraction
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Log Distraction Event"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            Record what drew your attention away. Distractions deduct from your session Focus Score: <code>Score = max(0, 100 - (distractions × 10))</code>.
          </p>

          {/* Quick chips for suggested reasons */}
          <div>
            <label className="block text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-2">
              Common Triggers (1-Click)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUGGESTED_REASONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleRecord(label)}
                  className="flex items-center gap-2 p-2.5 rounded-md border border-border bg-surface hover:border-[#B47A35] hover:bg-[#FAF3E8]/70 text-xs font-medium text-ink transition-all text-left"
                >
                  <Icon className="h-3.5 w-3.5 text-[#B47A35] flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom optional reason */}
          <div>
            <label className="block text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-1.5">
              Or Custom Observation <span className="font-normal text-ink-faint normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRecord()}
              placeholder="e.g. Courier at door, unexpected phone call..."
              maxLength={100}
              className="w-full rounded-md border border-border px-3.5 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-forest bg-surface"
              autoFocus
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleRecord()}
              className="flex-1"
            >
              {customReason.trim() ? 'Log with Note' : 'Quick Log (No note)'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
